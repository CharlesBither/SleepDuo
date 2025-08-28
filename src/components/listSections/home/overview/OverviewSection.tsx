import {
  getBeforeNow,
  getLast14Days,
  getLast30Days,
} from "@/src/health-connect/sleep-data";
import { SleepRecord } from "@/src/records/SleepRecord";
import { useEffect, useState } from "react";
import { ReadRecordsResult } from "react-native-health-connect";
import { List } from "react-native-paper";
import DurationItem from "./DurationItem";

export default function OverviewSection() {
  const [last14Tst, setLast14Tst] = useState(-1);
  const [last30Tst, setLast30Tst] = useState(-1);
  const [allTimeTst, setAllTimeTst] = useState(-1);

  useEffect(() => {
    getLast14Days()
      .then((records) => handleLast14DaysResult(records))
      .catch((e) => {
        throw new Error("OverviewSection getLast14Days threw error: " + e);
      });

    getLast30Days()
      .then((records) => handleLast30DaysResult(records))
      .catch((e) => {
        throw new Error("OverviewSection getLast14Days threw error: " + e);
      });

    getBeforeNow().then((records) => handleBeforeNowResult(records));
  }, []);

  const handleLast14DaysResult = (
    records: ReadRecordsResult<"SleepSession">
  ): void => {
    const sleepArray = SleepRecord.constructSleepRecordArray(records);
    setLast14Tst(SleepRecord.getAverageTST(sleepArray));
  };

  const handleLast30DaysResult = (
    records: ReadRecordsResult<"SleepSession">
  ): void => {
    const sleepArray = SleepRecord.constructSleepRecordArray(records);
    setLast30Tst(SleepRecord.getAverageTST(sleepArray));
  };

  const handleBeforeNowResult = (
    records: ReadRecordsResult<"SleepSession">
  ): void => {
    const sleepArray = SleepRecord.constructSleepRecordArray(records);
    setAllTimeTst(SleepRecord.getAverageTST(sleepArray));
  };

  return (
    <DurationItem
      last14DaysTst={last14Tst}
      last30DaysTst={last30Tst}
      allTimeTst={allTimeTst}
    />
  );
}
