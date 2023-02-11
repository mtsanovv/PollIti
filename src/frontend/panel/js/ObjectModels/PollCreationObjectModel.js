class PollCreationObjectModel extends ObjectModel {
    constructor() {
        super();
        this.iId;
        this.sTtitle = '';
        this.sThreshold = '';
        this.aOptions = [];
        this.bIsErrorMessageDismissable = false;
    }

    getId() {
        return this.iId;
    }

    setId(iId) {
        this.iId = iId;
    }

    getTitle() {
        return this.sTtitle;
    }

    setTitle(sTtitle) {
        this.sTtitle = sTtitle;
    }

    getThreshold() {
        return this.sThreshold;
    }

    getThresholdPercentage() {
        const iThreshold = parseInt(this.sThreshold);
        if(!this.sThreshold || isNaN(iThreshold)) {
            // the validation should have the NaN case handled so basically the only time this condition should be met is when the threshold is an empty string
            return ValidationConstants.POLL_THRESHOLD_INPUT_MIN_VALUE;
        }
        return iThreshold;
    }

    setThreshold(sThreshold) {
        this.sThreshold = sThreshold;
    }

    getOptions() {
        return this.aOptions;
    }

    setOptionAt(iIndex, sOption) {
        this.aOptions[iIndex] = sOption;
    }

    removeOptionAt(iIndex) {
        this.aOptions.splice(iIndex, 1);
    }

    isErrorMessageDismissable() {
        return this.bIsErrorMessageDismissable;
    }

    setIsErrorMessageDismissable(bIsErrorMessageDismissable) {
        this.bIsErrorMessageDismissable = bIsErrorMessageDismissable;
    }

    getTitleFieldError() {
        const sTitle = this.getTitle();
        if(sTitle.length < ValidationConstants.POLL_TITLE_INPUT_MIN_LENGTH) {
            return ValidationMessages.POLL_TITLE_INPUT_MIN_LENGTH_NOT_MET;
        }

        return '';
    }

    getThresholdFieldError() {
        const sThreshold = this.getThreshold();
        if(!sThreshold) {
            return '';
        }

        if(!sThreshold.match(new RegExp(ValidationConstants.POLL_THRESHOLD_INPUT_REGEX))) {
            return ValidationMessages.POLL_THRESHOLD_INPUT_REGEX_REQUIREMENT_NOT_MET;
        }

        const iThreshold = parseInt(sThreshold); // it cannot be NaN since the regex makes sure the input contains digits only
        // since there can be no negative numbers due to the regex allowing only digits, we only need to check if the upper range limit was exceeded
        if(iThreshold > ValidationConstants.POLL_THRESHOLD_INPUT_MAX_VALUE) {
            return ValidationMessages.POLL_THRESHOLD_INPUT_RANGE_NOT_MET;
        }

        return '';
    }

    getOptionFieldErrorAt(iOptionIndex) {
        const aOptions = this.getOptions();
        if(iOptionIndex >= aOptions.length) {
            // array index out of bounds - this should not happen as the indexes are calculated per the options flex box wrapper items
            return '';
        }

        const sOption = aOptions[iOptionIndex];

        if(!sOption) {
            return ValidationMessages.REQUIRED_INPUT_EMPTY;
        }

        const iOptionOccurrences = aOptions.filter(sOptionTitle => sOptionTitle == sOption).length;
        if(iOptionOccurrences > 1) {
            return ValidationMessages.POLL_OPTION_INPUT_NOT_UNIQUE;
        }

        return '';
    }
}