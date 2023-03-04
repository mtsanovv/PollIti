class PollTrendsObjectModel extends ObjectModel {
    constructor(obj) {
        super(obj);
        this.aPolls = obj.polls;
        this.aPollsParticipatingInTrend = [];
        this.iPollInputIndexThatTriggeredSelectionDialog = 0;
        this.aHiddenPollsSelectDialogItemsIndices = []; // the default value is later overridden, it is here only to prevent undefined behavior
        this.aChartLabels;
        this.aChartDatasets;
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

    getChartDatasets() {
        return this.aChartDatasets;
    }

    getChartLabels() {
        return this.aChartLabels;
    }

    createChartDatasetsAndLabels(aPollModels) {
        const aSortedByIdAscendingPollModels = [...aPollModels];
        aSortedByIdAscendingPollModels.sort((a, b) => a.getId() - b.getId());

        this.aChartDatasets = [];
        this.aChartLabels = [];

        const aCustomOptionsForTrendLines = this.findCommonCustomOptionsBetweenPolls(aSortedByIdAscendingPollModels);

        // create datasets for options that are not undecided
        for(const sOption of aCustomOptionsForTrendLines) {
            const aData = this.getPercentagesFromEachPollForCustomOption(aSortedByIdAscendingPollModels, sOption);
            const oDataset = {
                label: sOption,
                data: aData
            };
            this.aChartDatasets.push(oDataset);
        }

        // since undecided is available in each poll, it is always added at the end of the dataset array
        this.aChartDatasets.push({ label: Globals.POLL_UNDECIDED_OPTION, data: [] });

        // add chart labels
        for(const oPollModel of aSortedByIdAscendingPollModels) {
            const aDatasetLabel = [Globals.POLL_ID_TITLE + ' ' + oPollModel.getId(), oPollModel.getCreationDate()];
            this.aChartLabels.push(aDatasetLabel);

            // we can make use of the already required iteration of all poll models and push the percentages for the undecided option to the respective dataset
            const aUndecidedDatasetData = this.aChartDatasets[this.aChartDatasets.length - 1].data;
            aUndecidedDatasetData.push(Globals.getOptionPercentage(oPollModel.getUndecidedVotes(), oPollModel.getTotalVotes()));
        }
    }

    getPercentagesFromEachPollForCustomOption(aPollModels, sOption) {
        const aPercentages = [];
        for(const oPollModel of aPollModels) {
            if(oPollModel.getOriginalSortedOptionsList().indexOf(sOption) == -1) {
                continue;
            }

            const oPollOptionsVotes = oPollModel.getOptionsVotes();
            const iPollTotalVotes = oPollModel.getTotalVotes();
            const iOptionVotes = oPollOptionsVotes[sOption];
            aPercentages.push(Globals.getOptionPercentage(iOptionVotes, iPollTotalVotes));
        }
        return aPercentages;
    }

    findCommonCustomOptionsBetweenPolls(aPollModels) {
        let aCommonOptions = [];

        for(const oPollModel of aPollModels) {
            const aPollOptions = oPollModel.getOriginalSortedOptionsList();
            if(!aCommonOptions.length) {
                aCommonOptions.push(...aPollOptions);
                continue;
            }
            aCommonOptions = this.findCommonOptions(aCommonOptions, aPollOptions)
        }

        return aCommonOptions;
    }

    findCommonOptions(aOptions1, aOptions2) {
        const oOptionsSet1 = new Set(aOptions1);
        return aOptions2.filter((sValue) => oOptionsSet1.has(sValue));
    }
}