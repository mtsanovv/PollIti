class ValidationMessages {
    static USERNAME_INPUT_MIN_LENGTH_NOT_MET = this.getMinimumLengthMessage(ValidationConstants.USERNAME_INPUT_MIN_LENGTH);
    static USERNAME_INPUT_REGEX_REQUIREMENT_NOT_MET = 'Only letters, numbers and underscores are allowed';

    static PASSWORD_INPUT_MIN_LENGTH_NOT_MET = this.getMinimumLengthMessage(ValidationConstants.PASSWORD_INPUT_MIN_LENGTH);
    static PASSWORD_INPUT_REGEX_REQUIREMENT_NOT_MET = 'Whitespaces are not allowed';

    static DISPLAY_NAME_INPUT_MIN_LENGTH_NOT_MET = this.getMinimumLengthMessage(ValidationConstants.DISPLAY_NAME_INPUT_MIN_LENGTH);

    static POLL_TITLE_INPUT_MIN_LENGTH_NOT_MET = this.getMinimumLengthMessage(ValidationConstants.POLL_TITLE_INPUT_MIN_LENGTH);

    static POLL_THRESHOLD_INPUT_REGEX_REQUIREMENT_NOT_MET = 'Only digits 0-9 are allowed';
    static POLL_THRESHOLD_INPUT_RANGE_NOT_MET = 'The number should be between ' + ValidationConstants.POLL_THRESHOLD_INPUT_MIN_VALUE + ' and ' + ValidationConstants.POLL_THRESHOLD_INPUT_MAX_VALUE;

    static POLL_OPTION_INPUT_NOT_UNIQUE = 'This option already exists';

    static PASSWORD_CONFIRMATION_DOES_NOT_MATCH_THE_PASSWORD = 'The passwords do not match';

    static CONNECTION_ERROR = 'The "' + Config.AGENCY_NAME + '" panel is currently unavailable, try again later';
    static UNEXPECTED_SERVER_RESPONSE = 'Unexpected response from the server';

    static ERROR_WHILE_DELETING_USER_PREFIX = "An error has occurred while deleting the user '";
    static ERROR_WHILE_DELETING_POLL = 'An error has occurred while deleting this poll';

    static REQUIRED_INPUT_EMPTY = 'Required';
    static INPUT_INVALID = 'Invalid';

    static INVITATION_SENT_SUCCESSFULLY = 'Invitation sent successfully';

    static MANUAL_VOTING_VOTE_CAST_FAIL = 'Your vote could not be cast. Bring this to the attention of the person in charge.';
    static MANUAL_VOTING_VOTE_CAST_SUCCESS = 'Your vote was cast successfully. Thank you!';

    static NOT_ENOUGH_POLLS_FOR_TRENDS = 'Trends cannot be visualized because there are less than ' + ValidationConstants.POLL_TRENDS_MIN_POLLS + ' polls available';

    static getMinimumLengthMessage(iMinLength) {
        return 'At least ' + iMinLength + ' characters are required';
    }
}