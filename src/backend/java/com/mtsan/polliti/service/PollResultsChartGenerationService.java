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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Comparator;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

@Service
public class PollResultsChartGenerationService {
    private final PollService pollService;
    private final ResourceLoader resourceLoader;
    @Value("${agency.name}")
    private String agencyName;

    @Autowired
    public PollResultsChartGenerationService(PollService pollService, ResourceLoader resourceLoader) {
        this.pollService = pollService;
        this.resourceLoader = resourceLoader;
        new JFXPanel(); // just to prepare the JFX toolkit - we don't really need this panel as we don't need any GUI visualization
    }

    public byte[] getPollResultsChartImage(Long pollId) throws ExecutionException, InterruptedException {
        BarChart<String, Long> chart = this.createBarChart();
        BarChart.Series<String, Long> series = this.createChartMainSeries(pollId, this.getTotalPollVotes(pollId));

        chart.getData().add(series);

        chart.setTitle(this.pollService.getPollTitleById(pollId));
        chart.setLegendVisible(false);
        chart.setHorizontalGridLinesVisible(false);
        chart.setVerticalGridLinesVisible(false);
        chart.setAnimated(false);

        return this.getImageByteArrayFromChart(chart);
    }

    private byte[] getImageByteArrayFromChart(BarChart<String, Long> chart) throws ExecutionException, InterruptedException {
        FutureTask<byte[]> drawingBarChartTask = this.generateBarChartTask(chart);
        Platform.runLater(drawingBarChartTask); // run it on the JFX thread
        return drawingBarChartTask.get();
    }

    private FutureTask<byte[]> generateBarChartTask(BarChart<String, Long> chart) {
        return new FutureTask<>(() -> {
            WritableImage chartImage = this.getChartAsImage(chart);
            return this.getImageByteArray(chartImage);
        });
    }

    private byte[] getImageByteArray(WritableImage image) throws IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ImageIO.write(SwingFXUtils.fromFXImage(image, null), Globals.CHART_IMAGE_FORMAT, byteArrayOutputStream);
        return byteArrayOutputStream.toByteArray();
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
        // since no extra labels can be added to the chart, we can put the watermark as a label of the x-axis
        xAxis.setLabel(this.getChartWatermarkText());
        xAxis.setTickMarkVisible(false);

        NumberAxis yAxis = new NumberAxis();
        yAxis.setTickLabelsVisible(false);
        yAxis.setOpacity(0);

        return new BarChart(xAxis, yAxis);
    }

    private String getChartWatermarkText() {
        return String.format(Globals.SOCIAL_MEDIA_POST_CHART_WATERMARK_FORMAT, this.agencyName, LocalDate.now(ZoneOffset.UTC).getYear());
    }

    private void displayLabelOnTopOfBar(BarChart.Data<String, Long> data, Long sumOfAllValues) {
        // in order to make the chart more informative, it is better to display percentages instead of the concrete values
        String percentageForBarLabel = this.pollService.getOptionSharePercentage(data.getYValue(), sumOfAllValues);
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
}
