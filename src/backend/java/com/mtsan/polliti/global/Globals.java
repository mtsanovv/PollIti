package com.mtsan.polliti.global;

public class Globals {
    public static final String REALM_NAME = "PollIti";
    public static final String ERROR_CONTENT_REASON = "reason";
    public static final short BCRYPT_ROUNDS = 10;
    public static final String INTERNAL_SERVER_ERROR_MESSAGE = "An error has occurred while processing your request";
    public static final String UNDECIDED_VOTES_OPTION_NAME = "Undecided";

    public static final String CHART_CSS_RESOURCE = "classpath:chart.css";
    public static final String CHART_CSS_UNDECIDED_VOTES_BAR_ID = "undecided-votes-bar";
    public static final String CHART_CSS_BAR_LABEL_ID = "bar-label";
    // Instagram is the pickiest platform, and they recommend 1080x566 for landscape pictures
    public static final short CHART_IMAGE_WIDTH = 1080;
    public static final short CHART_IMAGE_HEIGHT = 566;
    public static final String CHART_IMAGE_FORMAT = "png";
}
