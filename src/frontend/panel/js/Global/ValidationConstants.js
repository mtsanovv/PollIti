class ValidationConstants {
    static USERNAME_INPUT_MAX_LENGTH = 128;
    static USERNAME_INPUT_MIN_LENGTH = 3;
    static USERNAME_INPUT_REGEX =  '^\\w+$';

    static PASSWORD_INPUT_MAX_LENGTH = 50;
    static PASSWORD_INPUT_MIN_LENGTH = 8;
    static PASSWORD_INPUT_REGEX = '^[^\\s]+$';

    static DISPLAY_NAME_INPUT_MIN_LENGTH = 3;
    static DISPLAY_NAME_INPUT_MAX_LENGTH = 1024;

    static POLL_TITLE_INPUT_MIN_LENGTH = 10;
    static POLL_TITLE_INPUT_MAX_LENGTH = 256;

    static POLL_THRESHOLD_INPUT_MIN_VALUE = 0;
    static POLL_THRESHOLD_INPUT_MAX_VALUE = 60;
    static POLL_THRESHOLD_INPUT_REGEX = '^\\d+$';

    static POLL_OPTIONS_MIN_COUNT = 2;
    static POLL_OPTIONS_MAX_COUNT = 9;

    static POLL_OPTION_INPUT_MAX_LENGTH = 128;

    static EMAIL_INPUT_MAX_LENGTH = 320;
    static EMAIL_INPUT_REGEX = "^[^@]+[@][^@]+[\\.][^@]+$";
}