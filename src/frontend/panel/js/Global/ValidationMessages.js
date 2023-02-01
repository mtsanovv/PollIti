class ValidationMessages {
    static USERNAME_INPUT_MIN_LENGTH_NOT_MET = this.getMinimumLengthMessage(ValidationConstants.USERNAME_INPUT_MIN_LENGTH);
    static USERNAME_INPUT_REGEX_REQUIREMENT_NOT_MET = 'Only letters, numbers and underscores are allowed';

    static PASSWORD_INPUT_MIN_LENGTH_NOT_MET = this.getMinimumLengthMessage(ValidationConstants.PASSWORD_INPUT_MIN_LENGTH);
    static PASSWORD_INPUT_REGEX_REQUIREMENT_NOT_MET = 'Whitespaces are not allowed';

    static DISPLAY_NAME_INPUT_MIN_LENGTH_NOT_MET = this.getMinimumLengthMessage(ValidationConstants.DISPLAY_NAME_INPUT_MIN_LENGTH);

    static PASSWORD_CONFIRMATION_DOES_NOT_MATCH_THE_PASSWORD = 'The passwords do not match';

    static CONNECTION_ERROR = 'The "' + Config.AGENCY_NAME + '" panel is currently unavailable, try again later';
    static UNEXPECTED_SERVER_RESPONSE = 'Unexpected response from the server';

    static ERROR_WHILE_DELETING_USER_PREFIX = "An error has occurred while deleting the user '";

    static getMinimumLengthMessage(iMinLength) {
        return 'At least ' + iMinLength + ' characters are required';
    }
}