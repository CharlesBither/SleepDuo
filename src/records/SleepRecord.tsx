import { readRecord, ReadRecordsResult, RecordResult } from 'react-native-health-connect';

import { SleepDuoRecord } from '@/src/records/SleepDuoRecord';
import { dateToString } from '../utils/dates';

export class SleepRecord extends SleepDuoRecord {
    private _totalSleepTime: number = 0;
    private _sleepEfficiency: String = "0";
    private _timeStage1: number = 0; // time awake
    private _timeStage2: number = 0; // time asleep general
    private _timeStage3: number = 0; 
    private _timeStage4: number = 0;
    private _timeStage5: number = 0;
    private _timeStage6: number = 0;

    constructor(record: RecordResult<"SleepSession">) {
        super(record.metadata?.id, new Date(record.startTime), new Date(record.endTime), "sleep");

        // init TST
        const stages = record.stages;
        if (stages) {
            for (let i = 0; i < stages.length; i++) {
                const stage = stages[i];
                const stageStart = new Date(stage.startTime);
                const stageEnd = new Date(stage.endTime);
                const diff = stageEnd.getTime() - stageStart.getTime();
                if (stage.stage === 1) this._timeStage1 += diff;
                else if (stage.stage === 2) this._timeStage2 += diff;
                else if (stage.stage === 3) this._timeStage3 += diff;
                else if (stage.stage === 4) this._timeStage4 += diff;
                else if (stage.stage === 5) this._timeStage5 += diff;
                else this._timeStage6 += diff;
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

    static constructSleepRecordArray(records: ReadRecordsResult<"SleepSession">): SleepRecord[] {
        const res = [];
        for (const record of records.records) {
            res.push(new SleepRecord(record));
        }
        return res;
    }

    static getAverageTST(records: SleepRecord[]): number {
        if (records.length === 0) return 0;

        const dates = new Set<string>();
        let res = 0;
        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            res += record.totalSleepTime;
            dates.add(dateToString(record.date));
        }
        return res / dates.size;
    }

    static getAverageTimeInBed(records: SleepRecord[]): number {
        if (records.length === 0) return 0;

        const dates = new Set<string>();
        let res = 0;
        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            res += record.timeInBed;
            dates.add(dateToString(record.date));
        }
        return res / dates.size;
    }

    static getAverageSleepEfficiency(records: SleepRecord[]): string {
        if (records.length === 0) return '0';

        let tst = 0;
        let timeInBed = 0;
        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            tst += record.totalSleepTime;
            timeInBed += record.timeInBed;
        }
        return ((tst / timeInBed) * 100).toPrecision(2);
    }

    static async getSleepRecord(guid: string): Promise<SleepRecord | undefined> {
        const healthConnectRecord = await readRecord("SleepSession", guid);
        console.log(healthConnectRecord);
        if (healthConnectRecord) {
            return new SleepRecord(healthConnectRecord);
        }
        return undefined;
    }
}