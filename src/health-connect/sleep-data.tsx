import { readRecords, ReadRecordsResult } from "react-native-health-connect";
import { getBeginningOfLast14Days, getBeginningOfLast30Days, getBeginningOfLast7Days } from "../utils/dates";

const now = () => {
  return new Date();
};

/** returns Promise<ReadRecordsResult<"SleepSession">> containing sleep records in the past 14 days */
export async function getLast7Days(): Promise<ReadRecordsResult<"SleepSession">> {
  return await readRecords("SleepSession", {
    ascendingOrder: false,
    timeRangeFilter: {
      operator: "between",
      startTime: getBeginningOfLast7Days().toISOString(),
      endTime: now().toISOString(),
    },
  });
}

/** returns Promise<ReadRecordsResult<"SleepSession">> containing sleep records in the past 14 days */
export async function getLast14Days(): Promise<ReadRecordsResult<"SleepSession">> {
  return await readRecords("SleepSession", {
    ascendingOrder: false,
    timeRangeFilter: {
      operator: "between",
      startTime: getBeginningOfLast14Days().toISOString(),
      endTime: now().toISOString(),
    },
  });
}

/** returns Promise<ReadRecordsResult<"SleepSession">> containing sleep records in the past 30 days */
export async function getLast30Days(): Promise<ReadRecordsResult<"SleepSession">> {
  return await readRecords("SleepSession", {
    ascendingOrder: false,
    timeRangeFilter: {
      operator: "between",
      startTime: getBeginningOfLast30Days().toISOString(),
      endTime: now().toISOString(),
    },
  });
}

/** returns Promise<ReadRecordsResult<"SleepSession">> containing sleep records before the current time */
export async function getBeforeNow(): Promise<ReadRecordsResult<"SleepSession">> {
  return await readRecords("SleepSession", {
    ascendingOrder: false,
    timeRangeFilter: {
      operator: "before",
      endTime: now().toISOString(),
    },
  });
}