class UsersListingObjectModel extends ObjectModel {
    constructor(obj) {
        super(obj);
        this.aUsers = obj.users;
        this.sUsernameToDelete = obj.usernameToDelete;
    }

    getUsers() {
        return this.aUsers;
    }

    getUsernameToDelete() {
        return this.sUsernameToDelete;
    }
}