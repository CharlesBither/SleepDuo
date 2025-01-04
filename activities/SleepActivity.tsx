import { RecordResult } from 'react-native-health-connect';
import { getLocales, getCalendars } from 'expo-localization';

import { Activity } from '@/activities/Activity';

export class SleepActivity extends Activity {
    private _record: RecordResult<"SleepSession">;
    private _totalSleepTime: number = 0;
    private _sleepEfficiency: String = "0";
    private _timeStage1: number = 0; // time awake
    private _timeStage2: number = 0; // time asleep general
    private _timeStage4: number = 0;
    private _timeStage5: number = 0;
    private _timeStage6: number = 0;
    
    constructor(record: RecordResult<"SleepSession">) {
        super(new Date(record.startTime), new Date(record.endTime));

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
        this._sleepEfficiency = ((this._totalSleepTime / this.activityDuration) * 100).toPrecision(2);
    }

    get totalSleepTime(): number {
        return this._totalSleepTime;
    }

    get timeInBed(): number {
        return this.activityDuration;
    }

    get sleepEfficiency(): String {
        return this._sleepEfficiency;
    }

    getMinutesAsleep(): number {
        return Math.floor(this._totalSleepTime / 1000 / 60) % 60;
    }

    getHoursAsleep(): number {
        return Math.floor(this._totalSleepTime / 1000 / 60 / 60);
    }

}