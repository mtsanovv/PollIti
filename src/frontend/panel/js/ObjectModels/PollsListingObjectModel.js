class PollsListingObjectModel extends ObjectModel {
    constructor(obj) {
        super(obj);
        this.aPolls = obj.polls;
    }

    getPolls() {
        return this.aPolls;
    }
}