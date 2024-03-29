package com.mtsan.polliti.global;

public class ValidationConstants {
    public static final short PASSWORD_MIN = 8;
    public static final short PASSWORD_MAX = 50;
    public static final String PASSWORD_REGEX = "^[^\\s]+$";

    public static final short USERNAME_MIN = 6;
    public static final short USERNAME_MAX = 30;
    public static final String USERNAME_REGEX = "^\\w+$";

    public static final short DISPLAY_NAME_MIN = 3;
    public static final short DISPLAY_NAME_MAX = 128;

    public static final short POLL_TITLE_MIN = 10;
    public static final short POLL_TITLE_MAX = 256;

    public static final short POLL_THRESHOLD_MIN_VALUE = 0;
    public static final short POLL_THRESHOLD_MAX_VALUE = 60;

    public static final short POLL_OPTIONS_MIN_COUNT = 2;
    public static final short POLL_OPTIONS_MAX_COUNT = 9;
    public static final short POLL_OPTION_MAX = 32;

    public static final short MIN_OPTIONS_THAT_MEET_THRESHOLD_IN_ORDER_TO_POST_TO_SOCIAL = 2;

    public static final short EMAIL_ADDRESS_MAX = 320;
    public static final String EMAIL_REGEX = ".+[@].+[\\.].+";
}
