class LoginObjectModel extends ObjectModel {
    constructor(obj) {
        super(obj);
        this.sUsername = obj.username;
        this.sPassword = obj.password;
    }

    getUsername() {
        return this.sUsername;
    }

    getPassword() {
        return this.sPassword;
    }
}