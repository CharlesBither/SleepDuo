import {
    RecordResult,
  } from 'react-native-health-connect';

export class SleepRecordInfo {
    private _totalSleepTime: number = 0;
    private _timeInBed: number = 0;
    private _sleepEfficiency: number = 0;

    constructor(record: RecordResult<"SleepSession">) {
        // initialize timeInBed
        const startInBed = new Date(record.startTime);
        const endInBed = new Date(record.endTime);
        this._timeInBed = endInBed.getTime() - startInBed.getTime();

        // init TST


        //init sleepEfficiency
    }

    get timeInBed(): number {
        return this._timeInBed;
    }
}