class MainObjectModel {
    constructor(json) {
        this.message = json.message;
        this.pollTitle = json.pollTitle;
        this.pollOptions = json.pollOptions;
    }

    getMessage() {
        return this.message;
    }

    getPollTitle() {
        return this.pollTitle;
    }

    getPollOptions() {
        return this.pollOptions;
    }
}