export class Record {
    private _date: Date;
    private _startTime: Date;
    private _endTime: Date;
    private _recordDuration: number;
    private _recordType: String;

    constructor(startTime: Date, endTime: Date, recordType: String) {
        this._startTime = startTime;
        this._endTime = endTime;
        this._date = new Date(endTime);
        this._date.setHours(0, 0, 0, 0);
        this._recordDuration = this._startTime.getTime() - this._endTime.getTime();
        this._recordType = recordType;
    }

    get date() {
        return this._date;
    }

    get startTime() {
        return this._startTime;
    }

    get endTime() {
        return this._endTime;
    }

    get recordDuration() {
        return this._recordDuration;
    }

    get recordType() {
        return this._recordType;
    }
}