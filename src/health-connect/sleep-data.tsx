import { readRecords } from "react-native-health-connect";
import { DateFormatter } from "../utils/DateFormatter";

const now = () => {
  return new Date();
};

export async function getLast14Days() {
  return await readRecords("SleepSession", {
    ascendingOrder: false,
    timeRangeFilter: {
      operator: "between",
      startTime: DateFormatter.getBeginningOfLast14Days().toISOString(),
      endTime: now().toISOString(),
    },
  });
}
