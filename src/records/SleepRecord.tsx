import { RecordResult } from 'react-native-health-connect';

import { Record } from '@/src/records/Record';

export class SleepRecord extends Record {
    private _record: RecordResult<"SleepSession">;
    private _totalSleepTime: number = 0;
    private _sleepEfficiency: String = "0";
    private _timeStage1: number = 0; // time awake
    private _timeStage2: number = 0; // time asleep general
    private _timeStage4: number = 0;
    private _timeStage5: number = 0;
    private _timeStage6: number = 0;

    constructor(record: RecordResult<"SleepSession">) {
        super(new Date(record.startTime), new Date(record.endTime), "sleep");

        this._record = record;

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
                else if (stage.stage === 6) this._timeStage6 += diff;
                else this._timeStage2 += diff;
            }
            this._totalSleepTime = this._timeStage2 + this._timeStage4 + this._timeStage5 + this._timeStage6;
        }

        //init sleepEfficiency
        this._sleepEfficiency = ((this._totalSleepTime / this.recordDuration) * 100).toPrecision(2);
    }

    get totalSleepTime(): number {
        return this._totalSleepTime;
    }

    get timeInBed(): number {
        return this.recordDuration;
    }

    get sleepEfficiency(): String {
        return this._sleepEfficiency;
    }

    static getAverageTST(activites: Record[]): number {
        //TODO: add dates to set. return res / set.length 
        let res = 0, count = 0;
        for (let i = 0; i < activites.length; i++) {
            const activity = activites[i];
            if (activity.recordType === "sleep") {
                res += (activity as SleepRecord).totalSleepTime;
                count++;
            }
        }
        if (count === 0) return 0;
        return res / count;
    }
}