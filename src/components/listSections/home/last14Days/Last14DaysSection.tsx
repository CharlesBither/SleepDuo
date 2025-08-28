import { getLast14Days } from "@/src/health-connect/sleep-data";
import { SleepRecord } from "@/src/records/SleepRecord";
import { useEffect, useState } from "react";
import { ReadRecordsResult } from "react-native-health-connect";
import { List } from "react-native-paper";
import TstItem from "./TstItem";

export default function Last14DaysSection() {
  const [sleepArray, setSleepArray] = useState<SleepRecord[]>([]);
  const [averageTst, setAverageTst] = useState(-1);

  useEffect(() => {
    getSleepRecords()
      .then(() => {
        setAverageTst(SleepRecord.getAverageTST(sleepArray));
      })
  }, [averageTst]);

  /** Gets ReadRecordsResult<"SleepSession"> from last 14 days */
  const getSleepRecords = async (): Promise<void> => {
    try {
      const data = await getLast14Days();
      return initSleepArray(data);
    } catch {
      return console.log("could not get sleep data");
    }
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

  return (
    <List.Section>
      <List.Subheader>Last 14 days</List.Subheader>
      <TstItem averageTst={averageTst} />
    </List.Section>
  );
}
