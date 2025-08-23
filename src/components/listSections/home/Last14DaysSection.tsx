import { getLast14Days } from "@/src/health-connect/sleep-data";
import { SleepRecord } from "@/src/records/SleepRecord";
import { getHours, getMinutes } from "@/src/utils/dates";
import { useState } from "react";
import { ReadRecordsResult } from "react-native-health-connect";
import { List } from "react-native-paper";

export default function Last14DaysSection() {
  const [sleepArray, setSleepArray] = useState<SleepRecord[]>([]);

  /** Gets ReadRecordsResult<"SleepSession"> from last 14 days */
  const getSleepRecords = (): void => {
    getLast14Days()
      .then((data) => initSleepArray(data))
      .catch(() => console.log("could not get sleep data"));
  };

  /**
   * Creates a list of SleepRecords and assigns to sleepArray.
   * @param data ReadRecordsResult<"SleepSession"> containing 14 days of sleep data.
   */
  const initSleepArray = (data: ReadRecordsResult<"SleepSession">): void => {
    let arr: SleepRecord[] = [];
    const records = data.records;
    for (let i = 0; i < records.length; i++) {
      const currSleepActivity = new SleepRecord(records[i]);
      arr.push(currSleepActivity);
    }

    if (arr.length != sleepArray.length && arr.length !== 0) {
      setSleepArray(arr);
    }
  };

  /** Average total sleep time over the last 14 days */
  const currAverageTST = SleepRecord.getAverageTST(sleepArray);
  const averageTSTDescription =
    getHours(currAverageTST) +
    "h " +
    getMinutes(currAverageTST) +
    "m";

    getSleepRecords();

  return (
    <List.Section>
      <List.Subheader>Last 14 days</List.Subheader>
      <List.Item title="Total Sleep Time" description={averageTSTDescription} />
    </List.Section>
  );
}
