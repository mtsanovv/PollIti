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
}
