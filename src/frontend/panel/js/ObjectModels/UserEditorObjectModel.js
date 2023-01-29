class UserEditorObjectModel extends ObjectModel {
    constructor(obj) {
        super(obj);
        this.bIsUserUpdate = obj.isUserUpdate ?? false;
        this.bIsSuccess = false;
        this.sUsername = obj.username;
        this.sPassword = obj.password;
        this.sPasswordConfirmation;
        this.sDisplayName = obj.displayName;
        this.bEnabled = obj.enabled;
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

    getEnabled() {
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

    setEnabled(bEnabled) {
        this.bEnabled = bEnabled;
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
}