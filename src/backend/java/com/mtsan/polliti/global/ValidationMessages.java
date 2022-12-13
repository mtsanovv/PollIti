package com.mtsan.polliti.global;

public class ValidationMessages {
    // usage of String.format yields "attribute value must be constant" when the messages are used in the validation annotations
    // thus, we can only use the concatenation operator
    private static final String THE_PREFIX = "The ";
    private static final String MUST_NOT_BE_EMPTY_SUFFIX = " must not be empty";
    private static final String CHARACTERS_LONG_SUFFIX = " characters long";
    private static final String HAS_TO_BE_BETWEEN_GLUE = " has to be between ";
    private static final String AND_GLUE = " and ";

    private static final String PASSWORD_FIELD_NAME = "password";
    public static final String PASSWORD_EMPTY = THE_PREFIX + PASSWORD_FIELD_NAME + MUST_NOT_BE_EMPTY_SUFFIX;
    public static final String PASSWORD_REQUIREMENTS = THE_PREFIX +
                                                       PASSWORD_FIELD_NAME +
                                                       HAS_TO_BE_BETWEEN_GLUE +
                                                       ValidationConstants.PASSWORD_MIN +
                                                       AND_GLUE +
                                                       ValidationConstants.PASSWORD_MAX +
                                                       CHARACTERS_LONG_SUFFIX;
    public static final String PASSWORD_CHAR_REQUIREMENTS = THE_PREFIX + PASSWORD_FIELD_NAME + " cannot contain whitespaces";

    private static final String USERNAME_FIELD_NAME = "username";
    public static final String USERNAME_EMPTY = THE_PREFIX + USERNAME_FIELD_NAME + MUST_NOT_BE_EMPTY_SUFFIX;
    public static final String USERNAME_REQUIREMENTS = THE_PREFIX +
                                                       USERNAME_FIELD_NAME +
                                                       HAS_TO_BE_BETWEEN_GLUE +
                                                       ValidationConstants.USERNAME_MIN +
                                                       AND_GLUE +
                                                       ValidationConstants.USERNAME_MAX +
                                                       CHARACTERS_LONG_SUFFIX;
    public static final String USERNAME_CHAR_REQUIREMENTS = THE_PREFIX + USERNAME_FIELD_NAME + " can contain only letters, numbers or underscores";

    private static final String DISPLAY_NAME_FIELD_NAME = "display name";
    public static final String DISPLAY_NAME_EMPTY = THE_PREFIX + DISPLAY_NAME_FIELD_NAME + MUST_NOT_BE_EMPTY_SUFFIX;
    public static final String DISPLAY_NAME_REQUIREMENTS = THE_PREFIX +
                                                           DISPLAY_NAME_FIELD_NAME +
                                                           HAS_TO_BE_BETWEEN_GLUE +
                                                           ValidationConstants.DISPLAY_NAME_MIN +
                                                           AND_GLUE +
                                                           ValidationConstants.DISPLAY_NAME_MAX +
                                                           CHARACTERS_LONG_SUFFIX;

    private static final String POLL_TITLE_FIELD_NAME = "poll title";
    public static final String POLL_TITLE_EMPTY = THE_PREFIX + POLL_TITLE_FIELD_NAME + MUST_NOT_BE_EMPTY_SUFFIX;
    public static final String POLL_TITLE_REQUIREMENTS = THE_PREFIX +
                                                         POLL_TITLE_FIELD_NAME +
                                                         HAS_TO_BE_BETWEEN_GLUE +
                                                         ValidationConstants.POLL_TITLE_MIN +
                                                         AND_GLUE +
                                                         ValidationConstants.POLL_TITLE_MAX +
                                                         CHARACTERS_LONG_SUFFIX;

    private static final String POLL_THRESHOLD_FIELD_NAME = "poll threshold";
    public static final String POLL_THRESHOLD_REQUIRED = THE_PREFIX + POLL_THRESHOLD_FIELD_NAME + " is required to be set";
    public static final String POLL_THRESHOLD_REQUIREMENTS = THE_PREFIX +
                                                              POLL_THRESHOLD_FIELD_NAME +
                                                              HAS_TO_BE_BETWEEN_GLUE +
                                                              ValidationConstants.POLL_THRESHOLD_MIN_VALUE +
                                                              AND_GLUE +
                                                              ValidationConstants.POLL_THRESHOLD_MAX_VALUE +
                                                              " percent";


    private static final String POLL_WITH_ID_PREFIX = "Poll with ID '%d' ";
    public static final String POLL_NOT_FOUND = POLL_WITH_ID_PREFIX + "not found";
    public static final String POLL_OPTIONS_ALREADY_ADDED = POLL_WITH_ID_PREFIX + "already has options added";

    private static final String POLL_OPTIONS_PREFIX = "Poll options ";
    public static final String POLL_OPTIONS_UNIQUE = POLL_OPTIONS_PREFIX + "should be unique";
    public static final String POLL_OPTIONS_MAX_COUNT = POLL_OPTIONS_PREFIX + "should be no more than " + ValidationConstants.POLL_OPTIONS_MAX_COUNT;

    private static final String USER_PREFIX = "User ";
    public static final String USER_NOT_FOUND = USER_PREFIX + "'%s' not found";
    public static final String USER_NOT_AGENT = USER_PREFIX + "'%s' is not an agent";

    private static final String POLL_OPTION_NAME = "poll option";
    public static final String POLL_OPTIONS_EMPTY = "At least one " + POLL_OPTION_NAME + " is required";
    public static final String POLL_OPTION_EMPTY = THE_PREFIX + POLL_OPTION_NAME + MUST_NOT_BE_EMPTY_SUFFIX;

    public static final String INVALID_FIELDS = "One or more fields contain invalid values";
    public static final String USERNAME_ALREADY_IN_USE = "The username '%s' is already in use";
    public static final String ENABLED_FIELD_REQUIRED = "The enabled property is required to be set to true or false";
    public static final String NO_POLLS_FOUND = "There are no polls available";
}
