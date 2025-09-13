import {
  readRecord,
  ReadRecordsResult,
  RecordResult,
} from "react-native-health-connect";
import { SleepRecord } from "../types/SleepRecord";
import { dateToString } from "./dates";
import { SleepStage } from "../types/SleepStage";
import { SleepRecordFilter } from "../types/SleepRecordFilter";
import { getBeforeNow } from "../lib/health-connect/sleep-data";
import { getRecordDetails, getRecordDetailsMapValues } from "../database/recordDetails";

export const constructSleepRecord = (
  record: RecordResult<"SleepSession">
): SleepRecord => {
  if (!record.metadata?.id) {
    throw new Error("record guid is undefined");
  }
  const guid = record.metadata.id;
  const startTime = new Date(record.startTime);
  const endTime = new Date(record.endTime);
  const timeInBed = endTime.getTime() - startTime.getTime();
  let totalSleepTime = 0;
  let sleepEfficiency = "0";
  let timeAwake = 0;
  let timeAsleepUnknown = 0;
  let timeLightSleep = 0;
  let timeDeepSleep = 0;
  let timeRemSleep = 0;

  const stages = record.stages;
  if (stages) {
    for (const stage of stages) {
      const stageStart = new Date(stage.startTime);
      const stageEnd = new Date(stage.endTime);
      const diff = stageEnd.getTime() - stageStart.getTime();
      if (stage.stage === 1 || stage.stage === 7) timeAwake += diff;
      else if (stage.stage === 2) timeAsleepUnknown += diff;
      else if (stage.stage === 4) timeLightSleep += diff;
      else if (stage.stage === 5) timeDeepSleep += diff;
      else if (stage.stage === 6) timeRemSleep += diff;
    }
    totalSleepTime =
      timeAsleepUnknown + timeLightSleep + timeDeepSleep + timeRemSleep;
    sleepEfficiency = ((totalSleepTime / timeInBed) * 100).toPrecision(2);
  }
  return {
    guid: guid,
    startTime: startTime,
    endTime: endTime,
    timeInBed: timeInBed,
    totalSleepTime: totalSleepTime,
    sleepEfficiency: sleepEfficiency,
    timeAwake: timeAwake,
    timeAsleepUnknown: timeAsleepUnknown,
    timeLightSleep: timeLightSleep,
    timeDeepSleep: timeDeepSleep,
    timeRemSleep: timeRemSleep,
  };
};

export const constructSleepRecordArray = (
  records: ReadRecordsResult<"SleepSession">
): SleepRecord[] => {
  const res = [];
  for (const record of records.records) {
    res.push(constructSleepRecord(record));
  }
  return res;
};

export const getAverageTst = (records: SleepRecord[]): number => {
  if (records.length === 0) return 0;
  const dates = new Set<string>();
  let res = 0;
  for (const record of records) {
    res += record.totalSleepTime;
    dates.add(dateToString(record.endTime));
  }
  return res / dates.size;
};

export const getAverageTimeInBed = (records: SleepRecord[]): number => {
  if (records.length === 0) return 0;
  const dates = new Set<string>();
  let res = 0;
  for (const record of records) {
    res += record.timeInBed;
    dates.add(dateToString(record.endTime));
  }
  return res / dates.size;
};

export const getAverageSleepEfficiency = (records: SleepRecord[]): string => {
  if (records.length === 0) return "0";
  let tst = 0;
  let timeInBed = 0;
  for (const record of records) {
    tst += record.totalSleepTime;
    timeInBed += record.timeInBed;
  }
  return ((tst / timeInBed) * 100).toPrecision(2);
};

export const getAverageTimeInStage = (
  records: SleepRecord[],
  stage: SleepStage
) => {
  let res = 0;
  let validRecords = 0;
  for (const record of records) {
    let target = record.timeAwake;
    if (stage === "light") target = record.timeLightSleep;
    else if (stage === "deep") target = record.timeDeepSleep;
    else if (stage === "rem") target = record.timeRemSleep;
    if (target !== 0) {
      res += target;
      validRecords += 1;
    }
  }
  return validRecords === 0 ? 0 : Math.floor(res / validRecords);
};

/**
 * 
 * @param guid The unique id of the health connect sleep record
 * @returns Promise of type SleepRecord
 */
export const getSleepRecordFromReadRecord = async (guid: string): Promise<SleepRecord> => {
  try {
    const healthConnectRecord = await readRecord("SleepSession", guid);
    if (!healthConnectRecord.metadata) {
      throw new Error("getSleepRecordFromReadRecord metadata is undefined");
    }
    return constructSleepRecord(healthConnectRecord);
  } catch(e) {
    throw new Error("getSleepRecordFromReadRecord threw error: " + e);
  }
}

/**
 * Gets all sleep records that are associated to a given filter. For example, if the filter is "alcohol",
 * then this function will return all SleepRecords where alcohol use was recorded.
 * @param filter An activity that is associated to a SleepSession
 * @returns SleepRecord[][] such that SleepRecord[0][] contains records where the filter is included
 * and SleepRecord[1][] contains records where the filter is excluded
 */
export const getSleepRecordArraysByFilter = async (filter: SleepRecordFilter): Promise<[SleepRecord[], SleepRecord[]]> => {
  const included = [];
  const excluded = [];

  const detailsArray = getRecordDetailsMapValues();
  for (const details of detailsArray) {
    const sleepRecord = await getSleepRecordFromReadRecord(details.guid);
    if ((filter === "alcohol" && details.alcohol_quantity !== "0")
      || (filter === "caffeine" && details.caffeine_quantity !== "0")) {
        included.push(sleepRecord);
    } else {
      excluded.push(sleepRecord);
    }
  }

  return [included, excluded];
}