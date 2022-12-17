package com.mtsan.polliti.service;

import com.mtsan.polliti.dto.poll.PollDto;
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
import javafx.scene.chart.XYChart;
import javafx.scene.image.WritableImage;
import javafx.scene.text.Text;
import javafx.stage.Stage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.Comparator;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

@Service
public class PollResultsChartGenerationService {
    private final PollService pollService;
    private ResourceLoader resourceLoader;

    @Autowired
    public PollResultsChartGenerationService(PollService pollService, ResourceLoader resourceLoader) {
        this.pollService = pollService;
        this.resourceLoader = resourceLoader;
    }

    public String getPollResultsChart(Long pollId) throws ExecutionException, InterruptedException {
        PollDto pollDto = this.pollService.getPollById(pollId);
        PollVotesDto pollVotesDto = this.pollService.getPollVotesThatMeetThresholdPercentage(pollId);
        PollVotesDto pollVotesDtoWithAllVotes = this.pollService.getPollVotes(pollId);
        String pollTitle = pollDto.getTitle();

        Long totalVotesForAllOptions = pollVotesDtoWithAllVotes.getUndecidedVotes();
        for(Long votes : pollVotesDtoWithAllVotes.getOptionsVotes().values()) {
            totalVotesForAllOptions += votes;
        }

        final Long totalVotes = totalVotesForAllOptions; // in order to be able to use it in the lambdas below

        new JFXPanel(); // prepare JavaFX toolkit - we don't really need this panel as we don't need any GUI visualization
        // maybe extract the bar chart creation to a new method
        CategoryAxis xAxis = new CategoryAxis();
        xAxis.setTickMarkVisible(false);
        NumberAxis yAxis = new NumberAxis();
        yAxis.setTickLabelsVisible(false);
        yAxis.setOpacity(0);

        BarChart<String, Long> chart = new BarChart(xAxis, yAxis);
        XYChart.Series<String, Long> series = new XYChart.Series<>();
        pollVotesDto.getOptionsVotes().entrySet().forEach(
                entry -> {
                    XYChart.Data<String, Long> data = new XYChart.Data<>(entry.getKey(), entry.getValue());
                    data.nodeProperty().addListener((ov, oldNode, node) -> {
                        if (node != null) {
                            displayLabelForData(data, totalVotes);
                        }
                    });
                    series.getData().add(data);
                }
        );
        series.getData().sort(
            Comparator.comparingLong(
                (XYChart.Data<String, Long> longValue) -> longValue.getYValue()
            ).reversed()
        );
        XYChart.Data<String, Long> undecidedVotesData = new XYChart.Data<>(Globals.UNDECIDED_VOTES_OPTION_NAME, pollVotesDto.getUndecidedVotes());
        undecidedVotesData.nodeProperty().addListener((ov, oldNode, node) -> {
            if (node != null) {
                undecidedVotesData.getNode().setId(Globals.CHART_CSS_UNDECIDED_VOTES_BAR_ID);
                displayLabelForData(undecidedVotesData, totalVotes);
            }
        });
        series.getData().add(undecidedVotesData);
        chart.getData().add(series);
        chart.setTitle(pollTitle);
        chart.setLegendVisible(false);
        chart.setHorizontalGridLinesVisible(false);
        chart.setVerticalGridLinesVisible(false);
        chart.setAnimated(false);
        FutureTask imageGenerationQuery = new FutureTask(() -> {
            // maybe extract to a new method
            Stage stage = new Stage();
            Scene scene = new Scene(chart, 1080, 566);
            scene.getStylesheets().add(this.resourceLoader.getResource(Globals.CHART_CSS_RESOURCE).getURL().toExternalForm());
            stage.setScene(scene);
            WritableImage img = new WritableImage(1080, 566);
            scene.snapshot(img);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(SwingFXUtils.fromFXImage(img, null), "png", baos);
            byte[] pgnBytes = baos.toByteArray();
            Base64.Encoder base64_enc = Base64.getEncoder();
            String base64_image = base64_enc.encodeToString(pgnBytes);
            return "<img src=\"data:image/png;base64," + base64_image + "\"/>";
        });
        Platform.runLater(imageGenerationQuery); // run the stage on the JavaFX thread
        return imageGenerationQuery.get().toString();
    }

    private void displayLabelForData(XYChart.Data<String, Long> data, Long sumOfAllValues) {
        Node node = data.getNode();
        double ratio = (double) data.getYValue() / sumOfAllValues;
        double percentage = ratio * 100;
        double roundedPercentage = Math.round(percentage * 10.0) / 10.0;
        Text dataText = new Text(roundedPercentage + "%");
        dataText.setId(Globals.CHART_CSS_BAR_LABEL_ID);
        node.parentProperty().addListener((ov, oldParent, parent) -> {
            Group parentGroup = (Group) parent;
            parentGroup.getChildren().add(dataText);
        });

        node.boundsInParentProperty().addListener((ov, oldBounds, bounds) -> {
            dataText.setLayoutX(
                    Math.round(
                            bounds.getMinX() + bounds.getWidth() / 2 - dataText.prefWidth(-1) / 2
                    )
            );
            dataText.setLayoutY(
                    Math.round(
                            bounds.getMinY() - dataText.prefHeight(-1) * 0.5
                    )
            );
        });
    }
}
