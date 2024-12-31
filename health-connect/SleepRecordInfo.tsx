import {
    RecordResult,
  } from 'react-native-health-connect';

export class SleepRecordInfo {
    _record: RecordResult<"SleepSession">;
    private _totalSleepTime: number = 0;
    private _timeInBed: number = 0;
    private _sleepEfficiency: String = "0";
    private _timeStage1: number = 0;
    private _timeStage4: number = 0;
    private _timeStage5: number = 0;
    private _timeStage6: number = 0;

    constructor(record: RecordResult<"SleepSession">) {
        this._record = record;

        // initialize timeInBed
        const startInBed = new Date(record.startTime);
        const endInBed = new Date(record.endTime);
        this._timeInBed = endInBed.getTime() - startInBed.getTime();

        // init TST
        const stages = record.stages;
        if (stages) {
            for (let i = 0; i < stages.length; i++) {
                const stage = stages[i];
                const stageStart = new Date(stage.startTime);
                const stageEnd = new Date(stage.endTime);
                const diff = stageEnd.getTime() - stageStart.getTime();
                if (stage.stage === 1) this._timeStage1 += diff;
                else if (stage.stage === 4) this._timeStage4 += diff;
                else if (stage.stage === 5) this._timeStage5 += diff;
                else this._timeStage6 += diff;
            }
            this._totalSleepTime = this._timeStage4 + this._timeStage5 + this._timeStage6;
        }

        //init sleepEfficiency
        this._sleepEfficiency = ((this._totalSleepTime / this._timeInBed) * 100).toPrecision(2);
    }

    get totalSleepTime(): number {
        return this._totalSleepTime;
    }

    get timeInBed(): number {
        return this._timeInBed;
    }

    get sleepEfficiency(): String {
        return this._sleepEfficiency;
    }
}