class ObjectModel {
    constructor(obj) {
        this.sMessage = obj.message;
    }

    getMessage() {
        return this.sMessage;
    }

    setMessage(sMessage) {
        this.sMessage = sMessage;
    }

    isBaseObjectModel() {
        if(this.getObjectModelClassName() == ObjectModel.name) {
            return true;
        }
        return false;
    }

    getObjectModelClassName() {
        return this.constructor.name;
    }
}