class PollLogsObjectModel extends ObjectModel {
    constructor(obj) {
        super(obj);
        this.aLogs = obj.logs;
    }

    getLogs() {
        return this.aLogs;
    }
}