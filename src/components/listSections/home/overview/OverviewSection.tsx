import {
  getBeforeNow,
  getLast30Days,
  getLast7Days,
} from "@/src/health-connect/sleep-data";
import { SleepRecord } from "@/src/records/SleepRecord";
import { useEffect, useState } from "react";
import { ReadRecordsResult } from "react-native-health-connect";
import DurationItem from "./DurationItem";
import OverviewIntervalSegmentedButton from "@/src/components/buttons/OverviewIntervalSegmentedButton";

export default function OverviewSection() {
  const [last7Tst, setLast7Tst] = useState(-1);
  const [last30Tst, setLast30Tst] = useState(-1);
  const [allTimeTst, setAllTimeTst] = useState(-1);
  const [interval, setInterval] = useState('7');

  useEffect(() => {
    getLast7Days()
      .then((records) => handleLast7DaysResult(records))
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

  const handleLast7DaysResult = (
    records: ReadRecordsResult<"SleepSession">
  ): void => {
    const sleepArray = SleepRecord.constructSleepRecordArray(records);
    setLast7Tst(SleepRecord.getAverageTST(sleepArray));
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
    <>
      <OverviewIntervalSegmentedButton interval={interval} setInterval={setInterval} />
      <DurationItem
        last7DaysTst={last7Tst}
        last30DaysTst={last30Tst}
        allTimeTst={allTimeTst}
      />
    </>
  );
}
