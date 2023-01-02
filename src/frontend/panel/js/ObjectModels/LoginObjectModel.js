class LoginObjectModel {
    constructor(obj) {
        this.sMessage = obj.message;
        this.sUsername = obj.username;
        this.sPassword = obj.password;
    }

    getMessage() {
        return this.sMessage;
    }

    getUsername() {
        return this.sUsername;
    }

    getPassword() {
        return this.sPassword;
    }
}