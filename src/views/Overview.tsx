import {
  getBeforeNow,
  getLast30Days,
  getLast7Days,
} from "@/src/lib/healthConnectSleepData";
import { useEffect, useState } from "react";
import { ReadRecordsResult } from "react-native-health-connect";
import OverviewSection from "../components/listSections/home/overview/OverviewSection";
import OverviewIntervalSegmentedButton from "@/src/components/buttons/OverviewIntervalSegmentedButton";
import { OverviewDetails } from "@/src/types/OverviewDetails";
import { Divider } from "react-native-paper";
import { constructSleepSessionArray, getAverageSleepEfficiency, getAverageTimeInBed, getAverageTimeInStage, getAverageTst } from "@/src/utils/sleepSession";
import { setErrorMsg } from "../stores/error";
import { useRouter } from "expo-router";

export default function OverviewContainer() {
  const [interval, setInterval] = useState('7');
  const [last7Details, setLast7Details] = useState<OverviewDetails | undefined>(undefined);
  const [last30Details, setLast30Details] = useState<OverviewDetails | undefined>(undefined);
  const [allTimeDetails, setAllTimeDetails] = useState<OverviewDetails | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    getLast7Days()
      .then((records) => handleLast7DaysResult(records))
      .catch((e) => {
        setErrorMsg("OverviewSection getLast7Days threw error: " + e);
        router.replace("/ErrorScreen");
      });

    getLast30Days()
      .then((records) => handleLast30DaysResult(records))
      .catch((e) => {
        setErrorMsg("OverviewSection getLast14Days threw error: " + e);
        router.replace("/ErrorScreen");
      });

    getBeforeNow().then((records) => handleBeforeNowResult(records));
  }, []);

  const handleLast7DaysResult = (
    records: ReadRecordsResult<"SleepSession">
  ): void => {
    const sleepArray = constructSleepSessionArray(records);
    setLast7Details({
      totalSleepTime: getAverageTst(sleepArray),
      timeInBed: getAverageTimeInBed(sleepArray),
      sleepEfficiency: getAverageSleepEfficiency(sleepArray),
      timeLightSleep: getAverageTimeInStage(sleepArray, "light"),
      timeDeepSleep: getAverageTimeInStage(sleepArray, "deep"),
      timeRemSleep: getAverageTimeInStage(sleepArray, "rem"),
    })
  };

  const handleLast30DaysResult = (
    records: ReadRecordsResult<"SleepSession">
  ): void => {
    const sleepArray = constructSleepSessionArray(records);
    setLast30Details({
      totalSleepTime: getAverageTst(sleepArray),
      timeInBed: getAverageTimeInBed(sleepArray),
      sleepEfficiency: getAverageSleepEfficiency(sleepArray),
      timeLightSleep: getAverageTimeInStage(sleepArray, "light"),
      timeDeepSleep: getAverageTimeInStage(sleepArray, "deep"),
      timeRemSleep: getAverageTimeInStage(sleepArray, "rem"),
    })
  };

  const handleBeforeNowResult = (
    records: ReadRecordsResult<"SleepSession">
  ): void => {
    const sleepArray = constructSleepSessionArray(records);
    setAllTimeDetails({
      totalSleepTime: getAverageTst(sleepArray),
      timeInBed: getAverageTimeInBed(sleepArray),
      sleepEfficiency: getAverageSleepEfficiency(sleepArray),
      timeLightSleep: getAverageTimeInStage(sleepArray, "light"),
      timeDeepSleep: getAverageTimeInStage(sleepArray, "deep"),
      timeRemSleep: getAverageTimeInStage(sleepArray, "rem"),
    })
  };

  return (
    <>
      <OverviewIntervalSegmentedButton interval={interval} setInterval={setInterval} />
      <OverviewSection
        last7Details={last7Details}
        last30Details={last30Details}
        allTimeDetails={allTimeDetails}
        interval={interval}
      />
      <Divider />
    </>
  );
}
