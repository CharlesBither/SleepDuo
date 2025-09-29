import {
  getBeforeNow,
  getLast30Days,
  getLast7Days,
} from "@/src/lib/healthConnectSleepData";
import { useEffect, useState } from "react";
import { ReadRecordsResult } from "react-native-health-connect";
import OverviewIntervalSegmentedButton from "@/src/components/buttons/OverviewIntervalSegmentedButton";
import { SleepSessionAvgData } from "@/src/types/SleepSessionAvgData";
import { Card, Divider, Text } from "react-native-paper";
import { constructSleepSessionArray, sleepSessionArrayToAvgData } from "@/src/utils/sleepSession";
import { setErrorMsg } from "../stores/error";
import { useRouter } from "expo-router";
import OverviewExploreCard from "../components/cards/OverviewExploreCard";
import SleepSessionAvgDataSection from "../components/listSections/SleepSessionAvgDataSection";
import LoadingScreen from "./LoadingScreen";
import { StyleSheet } from "react-native";

/**
 * This function computes average sleep data on an interval set of sleep sessions 
 * and renders the data for the user.
 */
export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [interval, setInterval] = useState('7');
  const [last7Data, setLast7Data] = useState<SleepSessionAvgData | undefined>(undefined);
  const [last30Data, setLast30Data] = useState<SleepSessionAvgData | undefined>(undefined);
  const [allTimeData, setAllTimeData] = useState<SleepSessionAvgData | undefined>(undefined);
  const router = useRouter();

  const targetData = interval === '7' ? last7Data :
    interval === '30' ? last30Data : allTimeData;

  useEffect(() => {
    const getLast7DaysPromise = getLast7Days()
      .then((records) => handleLast7DaysResult(records));

    const getLast30DaysPromise = getLast30Days()
      .then((records) => handleLast30DaysResult(records));

    const getBeforeNowPromise = getBeforeNow()
      .then((records) => handleBeforeNowResult(records));

    Promise.all([getLast7DaysPromise, getLast30DaysPromise, getBeforeNowPromise])
      .then(() => setLoading(false))
      .catch((e) => {
        setErrorMsg("Overview threw error: " + e);
        router.replace("/ErrorScreen");
      });
  }, [router]);

  const handleLast7DaysResult = (
    records: ReadRecordsResult<"SleepSession">
  ): void => {
    const sleepSessions = constructSleepSessionArray(records);
    setLast7Data(sleepSessionArrayToAvgData(sleepSessions))
  };

  const handleLast30DaysResult = (
    records: ReadRecordsResult<"SleepSession">
  ): void => {
    const sleepSessions = constructSleepSessionArray(records);
    setLast30Data(sleepSessionArrayToAvgData(sleepSessions))
  };

  const handleBeforeNowResult = (
    records: ReadRecordsResult<"SleepSession">
  ): void => {
    const sleepSessions = constructSleepSessionArray(records);
    setAllTimeData(sleepSessionArrayToAvgData(sleepSessions))
  };

  if (loading) return <LoadingScreen />

  else if (!targetData) {
    return (
      <Card style={{ ...styles.card }}>
        <Card.Content>
          <Text variant="titleMedium" style={{ ...styles.cardTitle }}>
            Not enough recorded sessions
          </Text>
          <Text variant="bodyMedium" style={{ ...styles.cardContent }}>
            Wear a Health-Connect-supported device to track your sleep to see this data.
          </Text>
        </Card.Content>
      </Card>
    )
  }
  return (
    <>
      <OverviewIntervalSegmentedButton interval={interval} setInterval={setInterval} />
      <SleepSessionAvgDataSection data={targetData} />
      <Divider />
      <OverviewExploreCard />
    </>
  );
}

const styles = StyleSheet.create({
    cardContent: {
        marginTop: 10,
    },
    cardTitle: {
        fontWeight: 600,
    },
    card: {
        margin: 20,
    },
});
