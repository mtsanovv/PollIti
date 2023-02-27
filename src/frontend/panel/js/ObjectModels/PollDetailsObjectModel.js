class PollDetailsObjectModel extends PollObjectModel {
    constructor(obj) {
        super(obj);
        this.bIsShowingPollDeletionDialog = false;
        this.sSharingError = obj.sharingError;
        this.bIsFacebookSharingSuccessful = obj.isFacebookSharingSuccessful;
        this.bIsFacebookAndInstagramSharingSuccessful = obj.isFacebookAndInstagramSharingSuccessful;
        this.sEmailAddress = obj.email ?? '';
        this.bIsSharingViaEmailSuccessful = obj.isSharingViaEmailSuccessful ?? false;
    }

    getOptionsSortedByValuesDescending() {
        const aOriginalSortedOptionsList = this.getOriginalSortedOptionsList();
        const aOptions = [...aOriginalSortedOptionsList];
        const oOptionsVotes = this.getOptionsVotes();

        aOptions.sort((a, b) => oOptionsVotes[b] - oOptionsVotes[a]);
        return aOptions;
    }

    getOptionsValuesSortedDescending() {
        const oOptionsVotes = this.getOptionsVotes();
        const aValues = Object.values(oOptionsVotes);
        aValues.sort((a, b) => b - a);
        return aValues;
    }

    isShowingPollDeletionDialog() {
        return this.bIsShowingPollDeletionDialog;
    }

    setIsShowingPollDeletionDialog(bIsShowingPollDeletionDialog) {
        this.bIsShowingPollDeletionDialog = bIsShowingPollDeletionDialog;
    }

    getSharingError() {
        return this.sSharingError;
    }

    isFacebookSharingSuccessful() {
        return this.bIsFacebookSharingSuccessful;
    }

    isFacebookAndInstagramSharingSuccessful() {
        return this.bIsFacebookAndInstagramSharingSuccessful;
    }

    getEmailAddress() {
        return this.sEmailAddress;
    }

    setEmailAddress(sEmailAddress) {
        this.sEmailAddress = sEmailAddress;
    }

    isSharingViaEmailSuccessful() {
        return this.bIsSharingViaEmailSuccessful;
    }

    getEmailAddressFieldError() {
        const sEmailAddress = this.getEmailAddress();

        if(!sEmailAddress) {
            return ValidationMessages.REQUIRED_INPUT_EMPTY;
        }

        if(!sEmailAddress.match(new RegExp(ValidationConstants.EMAIL_INPUT_REGEX))) {
            return ValidationMessages.INPUT_INVALID;
        }

        return '';
    }
}