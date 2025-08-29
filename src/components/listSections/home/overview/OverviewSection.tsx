import {
  getBeforeNow,
  getLast30Days,
  getLast7Days,
} from "@/src/lib/health-connect/sleep-data";
import { useEffect, useState } from "react";
import { ReadRecordsResult } from "react-native-health-connect";
import DurationItem from "./DurationItem";
import OverviewIntervalSegmentedButton from "@/src/components/buttons/OverviewIntervalSegmentedButton";
import { OverviewDetails } from "@/src/types/OverviewDetails";
import { Divider } from "react-native-paper";
import { constructSleepRecordArray, getAverageSleepEfficiency, getAverageTimeInBed, getAverageTst } from "@/src/utils/SleepRecord";

export default function OverviewSection() {
  const [interval, setInterval] = useState('7');
  const [last7Details, setLast7Details] = useState<OverviewDetails | undefined>(undefined);
  const [last30Details, setLast30Details] = useState<OverviewDetails | undefined>(undefined);
  const [allTimeDetails, setAllTimeDetails] = useState<OverviewDetails | undefined>(undefined);

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
    const sleepArray = constructSleepRecordArray(records);
    setLast7Details({
      totalSleepTime: getAverageTst(sleepArray),
      timeInBed: getAverageTimeInBed(sleepArray),
      sleepEfficiency: getAverageSleepEfficiency(sleepArray)
    })
  };

  const handleLast30DaysResult = (
    records: ReadRecordsResult<"SleepSession">
  ): void => {
    const sleepArray = constructSleepRecordArray(records);
    setLast30Details({
      totalSleepTime: getAverageTst(sleepArray),
      timeInBed: getAverageTimeInBed(sleepArray),
      sleepEfficiency: getAverageSleepEfficiency(sleepArray)
    })
  };

  const handleBeforeNowResult = (
    records: ReadRecordsResult<"SleepSession">
  ): void => {
    const sleepArray = constructSleepRecordArray(records);
    setAllTimeDetails({
      totalSleepTime: getAverageTst(sleepArray),
      timeInBed: getAverageTimeInBed(sleepArray),
      sleepEfficiency: getAverageSleepEfficiency(sleepArray)
    })
  };

  return (
    <>
      <OverviewIntervalSegmentedButton interval={interval} setInterval={setInterval} />
      <DurationItem
        last7Details={last7Details}
        last30Details={last30Details}
        allTimeDetails={allTimeDetails}
        interval={interval}
      />
      <Divider />
    </>
  );
}
