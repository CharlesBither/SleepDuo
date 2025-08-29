import { readRecord, ReadRecordsResult, RecordResult } from 'react-native-health-connect';

import { SleepDuoRecord } from '@/src/records/SleepDuoRecord';
import { dateToString } from '../utils/dates';

/**
 * Instances of this class contain methods to more easily access information from a RecordResult<"SleepSession">.
 * This class also contains static methods to create SleepRecord instances from RecordResult | ReadRecordsResult
 * as well as methods to calculate average data across arrays of sleep record instances.
 */
export class SleepRecord extends SleepDuoRecord {
    private _totalSleepTime: number = 0;
    private _sleepEfficiency: String = "0";
    private _timeAwake: number = 0;
    private _timeAsleepUnknown: number = 0;
    private _timeOutOfBed: number = 0; 
    private _timeLightSleep: number = 0;
    private _timeDeepSleep: number = 0;
    private _timeRemSleep: number = 0;

    constructor(record: RecordResult<"SleepSession">) {
        super(record.metadata?.id, new Date(record.startTime), new Date(record.endTime), "sleep");

        const stages = record.stages;
        if (stages) {
            for (let i = 0; i < stages.length; i++) {
                const stage = stages[i];
                const stageStart = new Date(stage.startTime);
                const stageEnd = new Date(stage.endTime);
                const diff = stageEnd.getTime() - stageStart.getTime();
                if (stage.stage === 1 || stage.stage === 7) this._timeAwake += diff;
                else if (stage.stage === 2) this._timeAsleepUnknown += diff;
                else if (stage.stage === 3) this._timeOutOfBed += diff;
                else if (stage.stage === 4) this._timeLightSleep += diff;
                else if (stage.stage === 5) this._timeDeepSleep += diff;
                else this._timeRemSleep += diff;
            }
            this._totalSleepTime = this._timeAsleepUnknown + this._timeLightSleep + this._timeDeepSleep + this._timeRemSleep;
        }

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

    get timeAwake(): number {
        return this._timeAwake;
    }

    get timeLightSleep(): number {
        return this._timeLightSleep;
    }

    get timeDeepSleep(): number {
        return this._timeDeepSleep;
    }

    get timeRemSleep(): number {
        return this._timeRemSleep;
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

    static getAverageTimeAwake(records: SleepRecord[]): number {
        let res = 0;
        let validRecords = 0;
        for (const record of records) {
            if (record._timeAwake !== 0) {
                res += record._timeAwake;
                validRecords += 1;
            }
        }
        return validRecords === 0 ? 0 : Math.floor(res / validRecords)
    }

    static getAverageTimeLightSleep(records: SleepRecord[]): number {
        let res = 0;
        let validRecords = 0;
        for (const record of records) {
            if (record._timeLightSleep !== 0) {
                res += record._timeLightSleep;
                validRecords += 1;
            }
        }
        return validRecords === 0 ? 0 : Math.floor(res / validRecords)
    }

    static getAverageTimeDeepSleep(records: SleepRecord[]): number {
        let res = 0;
        let validRecords = 0;
        for (const record of records) {
            if (record._timeDeepSleep !== 0) {
                res += record._timeDeepSleep;
                validRecords += 1;
            }
        }
        return validRecords === 0 ? 0 : Math.floor(res / validRecords)
    }

    static getAverageTimeRemSleep(records: SleepRecord[]): number {
        let res = 0;
        let validRecords = 0;
        for (const record of records) {
            if (record._timeRemSleep !== 0) {
                res += record._timeRemSleep;
                validRecords += 1;
            }
        }
        return validRecords === 0 ? 0 : Math.floor(res / validRecords)
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