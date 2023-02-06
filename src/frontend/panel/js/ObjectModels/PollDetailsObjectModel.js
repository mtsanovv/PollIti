class PollDetailsObjectModel extends ObjectModel {
    constructor(obj) {
        super(obj);
        this.iId = obj.id;
        this.sTitle = obj.title;
        this.iThreshold = obj.threshold;
        this.oOptionsVotes = obj.optionsVotes;
        this.iUndecidedVotes = obj.undecidedVotes;
        this.aOriginalSortedOptionsList = obj.originalOptionsListOrder;
        this.bIsShowingPollDeletionDialog = false;
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

    getTotalVotes() {
        let iTotalVotes = this.iUndecidedVotes;
        for(const oOption in this.oOptionsVotes) {
            iTotalVotes += this.oOptionsVotes[oOption];
        }
        return iTotalVotes;
    }

    getOptionsSortedByValuesDescending() {
        const aOptions = [...this.aOriginalSortedOptionsList];
        aOptions.sort((a, b) => this.oOptionsVotes[b] - this.oOptionsVotes[a]);
        return aOptions;
    }

    getOptionsValuesSortedDescending() {
        const aValues = Object.values(this.oOptionsVotes);
        aValues.sort((a, b) => b - a);
        return aValues;
    }

    isShowingPollDeletionDialog() {
        return this.bIsShowingPollDeletionDialog;
    }

    setIsShowingPollDeletionDialog(bIsShowingPollDeletionDialog) {
        this.bIsShowingPollDeletionDialog = bIsShowingPollDeletionDialog;
    }
}