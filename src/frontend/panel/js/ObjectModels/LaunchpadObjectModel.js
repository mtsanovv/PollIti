class LaunchpadObjectModel extends ObjectModel {
    constructor(obj) {
        super(obj);
        this.sRole = obj.role;
        this.sDisplayName = obj.displayName;
    }

    getRole() {
        return this.sRole;
    }

    getDisplayName() {
        return this.sDisplayName;
    }
}