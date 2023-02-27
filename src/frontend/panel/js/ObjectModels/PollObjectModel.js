class PollObjectModel extends ObjectModel {
    constructor(obj) {
        super(obj);
        this.iId = obj.id;
        this.sTitle = obj.title;
        this.iThreshold = obj.threshold;
        this.oOptionsVotes = obj.optionsVotes;
        this.iUndecidedVotes = obj.undecidedVotes;
        this.aOriginalSortedOptionsList = obj.options;
        this.sCreationDate = obj.creationDate;
    }

    getId() {
        return this.iId;
    }

    getTitle() {
        return this.sTitle;
    }

    getThreshold() {
        return this.iThreshold;
    }

    getOptionsVotes() {
        return this.oOptionsVotes;
    }

    getUndecidedVotes() {
        return this.iUndecidedVotes;
    }

    getOriginalSortedOptionsList() {
        return this.aOriginalSortedOptionsList;
    }

    getCreationDate() {
        return this.sCreationDate;
    }

    getTotalVotes() {
        let iTotalVotes = this.iUndecidedVotes;
        for(const oOption in this.oOptionsVotes) {
            iTotalVotes += this.oOptionsVotes[oOption];
        }
        return iTotalVotes;
    }
}