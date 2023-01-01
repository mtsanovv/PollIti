class LoginObjectModel {
    constructor(obj) {
        this.sMessage = obj.message;
        this.oAuthenticatedUser = obj.authenticatedUser;
    }

    getMessage() {
        return this.sMessage;
    }

    getAuthenticatedUser() {
        return this.oAuthenticatedUser;
    }
}