package com.mtsan.polliti.global;

public class ValidationConstants {
    public static final short PASSWORD_MIN = 8;
    public static final short PASSWORD_MAX = 50;
    public static final String PASSWORD_REGEX = "^[^\\s]+$";

    public static final short USERNAME_MIN = 3;
    public static final short USERNAME_MAX = 128;
    public static final String USERNAME_REGEX = "^\\w+$";

    public static final short DISPLAY_NAME_MIN = 3;
    public static final short DISPLAY_NAME_MAX = 1024;

    public static final short POLL_TITLE_MIN = 10;
    public static final short POLL_TITLE_MAX = 256;

    public static final short POLL_THRESHOLD_MIN_VALUE = 0;
    public static final short POLL_THRESHOLD_MAX_VALUE = 60;

    public static final short POLL_OPTIONS_MAX_COUNT = 10;
}
