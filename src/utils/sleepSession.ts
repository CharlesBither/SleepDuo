import {
  readRecord,
  ReadRecordsResult,
  RecordResult,
} from "react-native-health-connect";
import { SleepSession } from "../types/SleepSession";
import { dateToString } from "./dates";
import { SleepStage } from "../types/SleepStage";
import { SleepSessionFilter } from "../types/SleepSessionFilter";
import { getSleepSessionLogsMapValues } from "../database/sleepSessionLogs";

/**
 * Converts a raw Health Connect record into a normalized SleepRecord.
 * 
 * @param record - A Health Connect record returned by a function in `healthConnectSleepData.ts`.
 * @returns A SleepRecord object containing the fields from the provided record.
 */
export const constructSleepSession = (
  record: RecordResult<"SleepSession">
): SleepSession => {
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

/**
 * Converts raw Health Connect records into normalized SleepRecords.
 * 
 * @param records - Array of Health Connect records returned by a function in `healthConnectSleepData.ts`.
 * @returns An array of SleepRecords.
 */
export const constructSleepSessionArray = (
  records: ReadRecordsResult<"SleepSession">
): SleepSession[] => {
  const res = [];
  for (const record of records.records) {
    res.push(constructSleepSession(record));
  }
  return res;
};

/**
 * Calculates the average Total Sleep Time (TST) in milliseconds from a list of sleep records.
 * 
 * @param sleepSessions - An array of type 'SleepSession' to compute the average TST from.
 * @returns The average tst across all provided records in milliseconds.
 */
export const getAverageTst = (sleepSessions: SleepSession[]): number => {
  if (sleepSessions.length === 0) return 0;
  const dates = new Set<string>();
  let res = 0;
  for (const session of sleepSessions) {
    res += session.totalSleepTime;
    dates.add(dateToString(session.endTime));
  }
  return res / dates.size;
};

/**
 * Calculates the average time in bed in milliseconds from a list of sleep records.
 * 
 * @param sleepSessions - An array of type 'SleepSession' to compute the average time in bed from.
 * @returns The average time in bed across all provided records in milliseconds.
 */
export const getAverageTimeInBed = (sleepSessions: SleepSession[]): number => {
  if (sleepSessions.length === 0) return 0;
  const dates = new Set<string>();
  let res = 0;
  for (const session of sleepSessions) {
    res += session.timeInBed;
    dates.add(dateToString(session.endTime));
  }
  return res / dates.size;
};

/**
 * Calculates the average sleep efficiency from a list of sleep records.
 * 
 * @param sleepSessions - An array of type 'SleepSession' to compute the average sleep efficiency from.
 * @returns The average sleep efficiency across all provided records (i.e., tst / time in bed).
 */
export const getAverageSleepEfficiency = (sleepSessions: SleepSession[]): string => {
  if (sleepSessions.length === 0) return "0";
  let tst = 0;
  let timeInBed = 0;
  for (const session of sleepSessions) {
    tst += session.totalSleepTime;
    timeInBed += session.timeInBed;
  }
  return ((tst / timeInBed) * 100).toPrecision(2);
};

/**
 * Calculates the average time in a sleep stage in milliseconds from a list of sleep records.
 * 
 * @param sleepSessions - An array of type 'SleepSession' to compute the average time in stage from.
 * @param stage - The target SleepStage
 * @returns The average time in the provided stage across all provided records in milliseconds.
 */
export const getAverageTimeInStage = (
  sleepSessions: SleepSession[],
  stage: SleepStage
) => {
  let res = 0;
  let validRecords = 0;
  for (const session of sleepSessions) {
    let target = session.timeAwake;
    if (stage === "light") target = session.timeLightSleep;
    else if (stage === "deep") target = session.timeDeepSleep;
    else if (stage === "rem") target = session.timeRemSleep;
    if (target !== 0) {
      res += target;
      validRecords += 1;
    }
  }
  return validRecords === 0 ? 0 : Math.floor(res / validRecords);
};

/**
 * Retrieves a Health Connect sleep record by its unique identifier.
 * 
 * @param guid The unique id of the health connect sleep record
 * @returns A Promise that resolves to a SleepRecord.
 */
export const getSleepSessionFromReadRecord = async (guid: string): Promise<SleepSession> => {
  try {
    const healthConnectRecord = await readRecord("SleepSession", guid);
    if (!healthConnectRecord.metadata) {
      throw new Error("getSleepRecordFromReadRecord metadata is undefined");
    }
    return constructSleepSession(healthConnectRecord);
  } catch (e) {
    throw new Error("getSleepRecordFromReadRecord threw error: " + e);
  }
}

/**
 * Retrieves all sleep records grouped by whether they match a given activity filter such that
 * - `SleepRecord[0][]` Contains all records where the filter activity was recorded.
 * - `SleepRecord[1][]` Contains all records where the filter activity was not recorded.
 * 
 * @param filter An activity associated to a SleepSession.
 * @returns A tuple of SleepRecord arrays:
 *   - Index 0: Records that include the specified filter.
 *   - Index 1: Records that exclude the specified filter.
 */
export const getSleepSessionArraysByFilter = async (filter: SleepSessionFilter): Promise<[SleepSession[], SleepSession[]]> => {
  const included = [];
  const excluded = [];

  const detailsArray = getSleepSessionLogsMapValues();
  for (const details of detailsArray) {
    const sleepSession = await getSleepSessionFromReadRecord(details.guid);
    if ((filter === "alcohol" && details.alcohol_quantity !== "0")
      || (filter === "caffeine" && details.caffeine_quantity !== "0")) {
      included.push(sleepSession);
    } else {
      excluded.push(sleepSession);
    }
  }

  return [included, excluded];
}