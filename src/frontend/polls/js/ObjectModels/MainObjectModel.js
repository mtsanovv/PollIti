class MainObjectModel {
    constructor(obj) {
        this.sMessage = obj.message;
        this.bSuccess = obj.success;
        this.sPollTitle = obj.pollTitle;
        this.aPollOptions = obj.pollOptions;
        this.iSelectedOptionIndex;
    }

    getMessage() {
        return this.sMessage;
    }

    isSuccess() {
        if(this.bSuccess) {
            return true;
        }
        return false;
    }

    setSuccess(bNewSuccessStatus = false) {
        this.bSuccess = bNewSuccessStatus;
    }

    getPollTitle() {
        return this.sPollTitle;
    }

    getPollOptions() {
        return this.aPollOptions;
    }

    getSelectedOptionIndex() {
        return this.iSelectedOptionIndex;
    }

    setSelectedOptionIndex(iIndex) {
        this.iSelectedOptionIndex = iIndex;
    }
}