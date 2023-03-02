class PollTrendsObjectModel extends ObjectModel {
    constructor(obj) {
        super(obj);
        this.aPolls = obj.polls;
        this.aPollsParticipatingInTrend = [];
        this.iPollInputIndexThatTriggeredSelectionDialog = 0;
    }

    getPolls() {
        return this.aPolls;
    }

    removeParticipatingPollInTrendAt(iIndex) {
        this.aPollsParticipatingInTrend.splice(iIndex, 1);
    }

    findCommonOptionsBetweenTwoPolls(aFirstPollOptions, aSecondPollOptions) {
        const oFirstPollOptionsSet = new Set(aFirstPollOptions);
        return aSecondPollOptions.filter(sValue => oFirstPollOptionsSet.has(sValue));
    }

    getPollInputIndexThatTriggeredSelectionDialog() {
        return this.iPollInputIndexThatTriggeredSelectionDialog;
    }

    setPollInputIndexThatTriggeredSelectionDialog(iIndex) {
        this.iPollInputIndexThatTriggeredSelectionDialog = iIndex;
    }
}