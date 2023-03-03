class PollTrendsObjectModel extends ObjectModel {
    constructor(obj) {
        super(obj);
        this.aPolls = obj.polls;
        this.aPollsParticipatingInTrend = [];
        this.iPollInputIndexThatTriggeredSelectionDialog = 0;
        this.aHiddenPollsSelectDialogItemsIndices = [];
    }

    getPolls() {
        return this.aPolls;
    }

    getPollsParticipatingInTrend() {
        return this.aPollsParticipatingInTrend;
    }

    addPollToPollsParticipatingInTrend(iPollId, iSelectDialogItemIndex = null) {
        if(iSelectDialogItemIndex == null) {
            // this method was called as a result of poll input field addition
            this.aPollsParticipatingInTrend.push(null);
            return;
        }

        this.aPollsParticipatingInTrend[this.iPollInputIndexThatTriggeredSelectionDialog] = {
            pollId: iPollId,
            selectDialogItemIndex: iSelectDialogItemIndex
        };
    }

    nullPollThatIsParticipatingInTrend(iPollInputIndex) {
        this.aPollsParticipatingInTrend[iPollInputIndex] = null;
    }

    removeLastPollFromPollsParticipatingInTrend() {
        this.aPollsParticipatingInTrend.pop();
    }

    getPollInputIndexThatTriggeredSelectionDialog() {
        return this.iPollInputIndexThatTriggeredSelectionDialog;
    }

    setPollInputIndexThatTriggeredSelectionDialog(iIndex) {
        this.iPollInputIndexThatTriggeredSelectionDialog = iIndex;
    }

    getHiddenPollsSelectDialogItemsIndices() {
        return this.aHiddenPollsSelectDialogItemsIndices;
    }

    setHiddenPollsSelectDialogItemsIndices(aIndices) {
        this.aHiddenPollsSelectDialogItemsIndices = aIndices;
    }

    findCommonOptionsBetweenTwoPolls(aFirstPollOptions, aSecondPollOptions) {
        const oFirstPollOptionsSet = new Set(aFirstPollOptions);
        return aSecondPollOptions.filter(sValue => oFirstPollOptionsSet.has(sValue));
    }
}