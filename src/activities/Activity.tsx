export class Activity {
    private _date: Date;
    private _startTime: Date;
    private _endTime: Date;
    private _activityDuration: number;
    private _activityType: String;

    constructor(startTime: Date, endTime: Date, activityType: String) {
        this._startTime = startTime;
        this._endTime = endTime;
        this._date = new Date(endTime);
        this._date.setHours(0, 0, 0, 0);
        this._activityDuration = this._startTime.getTime() - this._endTime.getTime();
        this._activityType = activityType;
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

    get activityDuration() {
        return this._activityDuration;
    }

    get activityType() {
        return this._activityType;
    }
}