class UserEditorObjectModel extends ObjectModel {
    constructor() {
        super();
        this.bIsUserUpdate = false;
        this.bIsSuccess = false;
        this.sInitialUsername = '';
        this.sUsername = '';
        this.sPassword = '';
        this.sPasswordConfirmation = '';
        this.sDisplayName = '';
        this.bEnabled = true;
        this.bIsErrorMessageDismissable = false;
    }

    isUserUpdate() {
        return this.bIsUserUpdate;
    }

    setIsUserUpdate(bIsUserUpdate) {
        this.bIsUserUpdate = bIsUserUpdate;
    }

    isSuccess() {
        return this.bIsSuccess;
    }

    setIsSuccess(bIsSuccess) {
        this.bIsSuccess = bIsSuccess;
    }

    getInitialUsername() {
        return this.sInitialUsername;
    }

    setInitialUsername(sInitialUsername) {
        this.sInitialUsername = sInitialUsername;
    }

    getUsername() {
        return this.sUsername;
    }

    getPassword() {
        return this.sPassword;
    }

    getPasswordConfirmation() {
        return this.sPasswordConfirmation;
    }

    getDisplayName() {
        return this.sDisplayName;
    }

    isAgentAccountEnabled() {
        return this.bEnabled;
    }

    setUsername(sUsername) {
        this.sUsername = sUsername;
    }

    setPassword(sPassword) {
        this.sPassword = sPassword;
    }

    setPasswordConfirmation(sPasswordConfirmation) {
        this.sPasswordConfirmation = sPasswordConfirmation;
    }

    setDisplayName(sDisplayName) {
        this.sDisplayName = sDisplayName;
    }

    setAgentAccountEnabled(bEnabled) {
        this.bEnabled = bEnabled;
    }

    isErrorMessageDismissable() {
        return this.bIsErrorMessageDismissable;
    }

    setIsErrorMessageDismissable(bIsErrorMessageDismissable) {
        this.bIsErrorMessageDismissable = bIsErrorMessageDismissable;
    }

    getUsernameFieldError() {
        const sUsername = this.getUsername();
        if(sUsername.length < ValidationConstants.USERNAME_INPUT_MIN_LENGTH) {
            return ValidationMessages.USERNAME_INPUT_MIN_LENGTH_NOT_MET;
        }

        if(!sUsername.match(new RegExp(ValidationConstants.USERNAME_INPUT_REGEX))) {
            return ValidationMessages.USERNAME_INPUT_REGEX_REQUIREMENT_NOT_MET;
        }

        return '';
    }

    getDisplayNameFieldError() {
        const sDisplayName = this.getDisplayName();
        if(sDisplayName.length < ValidationConstants.DISPLAY_NAME_INPUT_MIN_LENGTH) {
            return ValidationMessages.DISPLAY_NAME_INPUT_MIN_LENGTH_NOT_MET;
        }

        return '';
    }

    getPasswordFieldError() {
        const sPassword = this.getPassword();
        if(sPassword.length < ValidationConstants.PASSWORD_INPUT_MIN_LENGTH) {
            return ValidationMessages.PASSWORD_INPUT_MIN_LENGTH_NOT_MET;
        }

        if(!sPassword.match(new RegExp(ValidationConstants.PASSWORD_INPUT_REGEX))) {
            return ValidationMessages.PASSWORD_INPUT_REGEX_REQUIREMENT_NOT_MET;
        }

        return '';
    }

    getPasswordConfirmationFieldError() {
        if(this.getPasswordConfirmation() != this.getPassword()) {
            return ValidationMessages.PASSWORD_CONFIRMATION_DOES_NOT_MATCH_THE_PASSWORD;
        }

        return '';
    }
}