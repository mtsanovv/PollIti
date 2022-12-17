package com.mtsan.polliti.service;

import com.mtsan.polliti.dto.poll.PollVotesDto;
import com.mtsan.polliti.global.Globals;
import javafx.application.Platform;
import javafx.embed.swing.JFXPanel;
import javafx.embed.swing.SwingFXUtils;
import javafx.scene.Group;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.chart.BarChart;
import javafx.scene.chart.CategoryAxis;
import javafx.scene.chart.NumberAxis;
import javafx.scene.image.WritableImage;
import javafx.scene.text.Text;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Comparator;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

@Service
public class PollResultsChartGenerationService {
    private final PollService pollService;
    private final ResourceLoader resourceLoader;

    @Autowired
    public PollResultsChartGenerationService(PollService pollService, ResourceLoader resourceLoader) {
        this.pollService = pollService;
        this.resourceLoader = resourceLoader;
        new JFXPanel(); // just to prepare the JFX toolkit - we don't really need this panel as we don't need any GUI visualization
    }

    public String getPollResultsChart(Long pollId) throws ExecutionException, InterruptedException {
        BarChart<String, Long> chart = this.createBarChart();
        BarChart.Series<String, Long> series = this.createChartMainSeries(pollId, this.getTotalPollVotes(pollId));

        chart.getData().add(series);

        chart.setTitle(this.getPollTitle(pollId));
        chart.setLegendVisible(false);
        chart.setHorizontalGridLinesVisible(false);
        chart.setVerticalGridLinesVisible(false);
        chart.setAnimated(false);

        return this.getBase64ImageFromChart(chart);
    }

    private String getBase64ImageFromChart(BarChart<String, Long> chart) throws ExecutionException, InterruptedException {
        FutureTask<String> drawingBarChartTask = this.generateBarChartTask(chart);
        Platform.runLater(drawingBarChartTask); // run it on the JFX thread
        return drawingBarChartTask.get();
    }

    private FutureTask<String> generateBarChartTask(BarChart<String, Long> chart) {
        return new FutureTask<>(() -> {
            WritableImage chartImage = this.getChartAsImage(chart);
            return this.getBase64FromWritableImage(chartImage);
        });
    }

    private String getBase64FromWritableImage(WritableImage image) throws IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ImageIO.write(SwingFXUtils.fromFXImage(image, null), Globals.CHART_IMAGE_FORMAT, byteArrayOutputStream);
        byte[] pngBytes = byteArrayOutputStream.toByteArray();
        Base64.Encoder base64_enc = Base64.getEncoder();
        return base64_enc.encodeToString(pngBytes);
    }

    private Scene getSceneFromChart(BarChart<String, Long> chart) throws IOException {
        Scene scene = new Scene(chart, Globals.CHART_IMAGE_WIDTH, Globals.CHART_IMAGE_HEIGHT);
        scene.getStylesheets().add(this.resourceLoader.getResource(Globals.CHART_CSS_RESOURCE).getURL().toExternalForm());
        return scene;
    }

    private WritableImage getChartAsImage(BarChart<String, Long> chart) throws IOException {
        Scene scene = this.getSceneFromChart(chart);
        WritableImage image = new WritableImage(Globals.CHART_IMAGE_WIDTH, Globals.CHART_IMAGE_HEIGHT);
        scene.snapshot(image);
        return image;
    }

    private Long getTotalPollVotes(Long pollId) {
        PollVotesDto pollVotesDtoWithAllVotes = this.pollService.getPollVotes(pollId);

        Long totalVotesForAllOptions = pollVotesDtoWithAllVotes.getUndecidedVotes();
        for(Long votes : pollVotesDtoWithAllVotes.getOptionsVotes().values()) {
            totalVotesForAllOptions += votes;
        }

        return totalVotesForAllOptions;
    }

    private BarChart.Series<String, Long> createChartMainSeries(Long pollId, Long totalVotes) {
        PollVotesDto pollVotesDto = this.pollService.getPollVotesThatMeetThresholdPercentage(pollId);

        BarChart.Series<String, Long> series = new BarChart.Series<>();

        pollVotesDto.getOptionsVotes().forEach((key, value) -> {
            BarChart.Data<String, Long> data = new BarChart.Data<>(key, value);
            data.nodeProperty().addListener((ov, oldNode, node) -> {
                if (node != null) {
                    this.displayLabelOnTopOfBar(data, totalVotes);
                }
            });
            series.getData().add(data);
        });

        // sort bars by descending height
        series.getData().sort(
            Comparator.comparingLong(
                (BarChart.Data<String, Long> longValue) -> longValue.getYValue()
            ).reversed()
        );

        // since the undecided votes are unaffected by poll thresholds, they need extra handling
        // they are also a separate poll property
        BarChart.Data<String, Long> undecidedVotesData = new BarChart.Data<>(Globals.UNDECIDED_VOTES_OPTION_NAME, pollVotesDto.getUndecidedVotes());
        undecidedVotesData.nodeProperty().addListener((ov, oldNode, node) -> {
            if (node != null) {
                // as a custom bar, undecided votes get custom css treatment
                undecidedVotesData.getNode().setId(Globals.CHART_CSS_UNDECIDED_VOTES_BAR_ID);
                this.displayLabelOnTopOfBar(undecidedVotesData, totalVotes);
            }
        });
        series.getData().add(undecidedVotesData);

        return series;
    }

    private BarChart<String, Long> createBarChart() {
        CategoryAxis xAxis = new CategoryAxis();
        xAxis.setTickMarkVisible(false);

        NumberAxis yAxis = new NumberAxis();
        yAxis.setTickLabelsVisible(false);
        yAxis.setOpacity(0);

        return new BarChart(xAxis, yAxis);
    }

    private String getPollTitle(Long pollId) {
        return this.pollService.getPollById(pollId).getTitle();
    }

    private void displayLabelOnTopOfBar(BarChart.Data<String, Long> data, Long sumOfAllValues) {
        // in order to make the chart more informative, it is better to display percentages instead of the concrete values
        String percentageForBarLabel = this.getPercentageForBarLabel(data.getYValue(), sumOfAllValues);
        Text labelText = new Text(percentageForBarLabel);
        labelText.setId(Globals.CHART_CSS_BAR_LABEL_ID);

        Node bar = data.getNode();
        bar.parentProperty().addListener((ov, oldParent, parent) -> {
            Group parentGroup = (Group) parent;
            parentGroup.getChildren().add(labelText);
        });

        bar.boundsInParentProperty().addListener((ov, oldBounds, bounds) -> {
            labelText.setLayoutX(
                Math.round(bounds.getMinX() + bounds.getWidth() / 2 - labelText.prefWidth(-1) / 2)
            );
            labelText.setLayoutY(
                Math.round(bounds.getMinY() - labelText.prefHeight(-1) * 0.5)
            );
        });
    }

    private String getPercentageForBarLabel(Long value, Long sumOfAllValues) {
        double ratio = (double) value / sumOfAllValues;
        double percentage = ratio * 100;
        double roundedPercentage = Math.round(percentage * 10.0) / 10.0;
        return roundedPercentage + "%";
    }
}
