class PollVotingObjectModel extends ObjectModel {
    constructor(obj) {
        super(obj);
        this.bIsSuccess = obj.success;
        this.sPollTitle = obj.title;
        this.aPollOptions = obj.options;
        this.iSelectedOptionIndex;
        this.sVotingError = obj.votingError;
    }

    isSuccess() {
        return this.bIsSuccess;
    }

    setSuccess(bIsSuccess) {
        this.bIsSuccess = bIsSuccess;
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

    getVotingError() {
        return this.sVotingError;
    }
}