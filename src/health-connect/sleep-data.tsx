import { readRecords } from "react-native-health-connect";
import { getBeginningOfLast14Days } from "../utils/dates";

const now = () => {
  return new Date();
};

export async function getLast14Days() {
  return await readRecords("SleepSession", {
    ascendingOrder: false,
    timeRangeFilter: {
      operator: "between",
      startTime: getBeginningOfLast14Days().toISOString(),
      endTime: now().toISOString(),
    },
  });
}
