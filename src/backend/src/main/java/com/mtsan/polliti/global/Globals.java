package com.mtsan.polliti.global;

public class Globals {
    public static final String REALM_NAME = "PollIti";
    public static final String X_FORWARDED_FOR_HEADER = "X-Forwarded-For";
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
    public static final short CHART_Y_AXIS_UPPER_BOUND_INCREASE = 16;

    public static final String FACEBOOK_URL_TEMPLATE = "https://www.facebook.com/%s";
    public static final String INSTAGRAM_URL_TEMPLATE = "https://www.instagram.com/%s";
    public static final String PUBLISH_TO_FACEBOOK_PHOTOS_TEMPLATE = "%s/photos";
    public static final String POST_TO_INSTAGRAM_MEDIA_TEMPLATE = "%s/media";
    public static final String PUBLISH_TO_INSTAGRAM_MEDIA_TEMPLATE = "%s/media_publish";
    public static final String SOCIAL_MEDIA_POST_TEMPLATE_NO_THRESHOLD = "According to %s, most of the respondents - %s (out of %d total), " +
                                                                         "would vote '%s' for \"%s\"";
    public static final String SOCIAL_MEDIA_POST_TEMPLATE_WITH_THRESHOLD = "According to %s, %d of the options will meet the %d%% threshold for \"%s\" " +
                                                                           "(%d poll respondents)";
    public static final String SOCIAL_MEDIA_POST_CHART_WATERMARK_FORMAT = "%s, %s";

    public static final String POLLS_TABLE_NAME = "polls";
    public static final String USERS_TABLE_NAME = "users";
    public static final String POLLS_OPTIONS_TABLE_NAME = "polls_options";
    public static final String POLLS_TOKENS_TABLE_NAME = "polls_tokens";
    public static final String POLLS_LOGS_TABLE_NAME = "polls_logs";
    public static final String POLLS_INVITEES_TABLE_NAME = "polls_invitees";

    public static final short POLL_TOKEN_WEEKS_BEFORE_IT_EXPIRES = 1;
    public static final String POLL_TOKEN_EMAIL_MESSAGE_SUBJECT = "Your opinion matters!";
    public static final String POLL_TOKEN_EMAIL_MESSAGE = "Good day,<br/><br/>" +
                                                          "We, from %s, would like to hear your opinion regarding \"%s\". " +
                                                          "We would be grateful if you could take a moment to respond to our poll: " +
                                                          "<a href=\"%s\" target=\"_blank\">%s</a> " +
                                                          "(if the link is not clickable, copy it and paste it in the address bar in your browser).<br/><br/>" +
                                                          "You don't have to hurry - the poll will be open until %s 23:59 GMT.<br/><br/>" +
                                                          "Best regards,<br/>" +
                                                          "%s";

    public static final String EMAIL_MESSAGE_FROM_HEADER = "%s <%s>";
    public static final String EMAIL_MESSAGE_FORMAT = "html";

    public static final String POLL_TOKEN_PURGE_CRON_EXPRESSION = "0 0 0 * * ?";
    public static final String POLL_TOKEN_PURGE_CRON_TIMEZONE = "Etc/GMT";

    public static final String POLLITI_ENCODING = "UTF-8";
    public static final String POLLITI_RESPONSES_TYPE = "application/json";

    public static final String POLLITI_FRONTEND_POLLS_APP_TOKEN_URL_FORMAT = "%s/polls/index.html?token=%s";

    public static final String POLLITI_POLL_ACTION_USER_LOG_MESSAGE_FORMAT = "%s '%s' %s";
    public static final String POLLITI_POLL_ACTION_LOG_INVITATION_INCREMENTED_VOTES_MESSAGE_FORMAT = "Poll invitee '%s' %s";
    public static final String POLLITI_POLL_ACTION_LOG_POLL_CREATED_PART_MESSAGE_FORMAT = "created poll '%s' (ID: %d)";
    public static final String POLLITI_POLL_ACTION_LOG_POLL_DELETED_PART_MESSAGE_FORMAT = "deleted poll '%s' (ID: %d)";
    public static final String POLLITI_POLL_ACTION_LOG_POLL_SHARED_TO_FB_PART_MESSAGE_FORMAT = "shared poll '%s' (ID: %d) to Facebook";
    public static final String POLLITI_POLL_ACTION_LOG_POLL_SHARED_TO_FB_AND_INSTA_PART_MESSAGE_FORMAT = "shared poll '%s' (ID: %d) to Facebook and Instagram";
    public static final String POLLITI_POLL_ACTION_LOG_SENT_POLL_INVITATION_PART_MESSAGE_FORMAT = "sent poll invitation to '%s' for '%s' (ID: %d)";
    public static final String POLLITI_POLL_ACTION_LOG_INCREMENTED_VOTES_COUNT_PART_MESSAGE_FORMAT = "incremented votes count for option '%s' for poll '%s' (ID: %d)";
    public static final String POLLITI_POLL_ACTION_LOG_MANUALLY_INCREMENTED_VOTES_PART_MESSAGE_FORMAT = "manually " +
                                                                                                        POLLITI_POLL_ACTION_LOG_INCREMENTED_VOTES_COUNT_PART_MESSAGE_FORMAT;
    public static final String POLLITI_POLL_ACTION_LOG_TIMESTAMP_FORMAT = "%1$TF %1$TT";
}
