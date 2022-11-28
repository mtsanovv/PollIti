package com.mtsan.polliti.global;

public class ValidationMessages {
    public static final String PASSWORD_EMPTY = "The password must not be empty";
    public static final String PASSWORD_REQUIREMENTS = "The password has to be between 8 and 50 characters long";
    public static final String PASSWORD_CHAR_REQUIREMENTS = "The password cannot contain whitespaces";

    public static final String USERNAME_EMPTY = "The username must not be empty";
    public static final String USERNAME_REQUIREMENTS = "The username has to be between 3 and 128 characters long";
    public static final String USERNAME_CHAR_REQUIREMENTS = "The username can contain only letters, numbers or underscores";

    public static final String DISPLAY_NAME_EMPTY = "The display name must not be empty";
    public static final String DISPLAY_NAME_REQUIREMENTS = "The display name has to be between 3 and 1024 characters long";

    public static final String INVALID_FIELDS = "One or more fields contain invalid values";
    public static final String USER_NOT_FOUND = "User '%s' not found";
    public static final String USERNAME_ALREADY_IN_USE = "The username '%s' is already in use";
    public static final String USER_NOT_AGENT = "User '%s' is not an agent";
    public static final String ENABLED_FIELD_REQUIRED = "The enabled property is required to be set to true or false";
}
