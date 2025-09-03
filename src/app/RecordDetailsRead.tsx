import { useLocalSearchParams } from "expo-router";
import ThemedView from "../components/ThemedView";
import { readRecord } from "react-native-health-connect";
import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import { SleepRecord } from "../types/SleepRecord";
import DuringSleepSection from "../components/listSections/RecordDetails/DuringSleepSection";
import RecordDetailsBeforeSleepCard from "../components/cards/RecordDetailsBeforeSleepCard";
import { constructSleepRecord } from "../utils/SleepRecord";

export default function RecordDetailsRead() {
  const { guid } = useLocalSearchParams<{ guid: string }>();

  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<SleepRecord | undefined>(undefined);

  useEffect(() => {
    readRecord("SleepSession", guid)
      .then(healthConnectRecord => {
        setRecord(constructSleepRecord(healthConnectRecord));
        setLoading(false);
      })
  }, []);

  if (loading) return <LoadingScreen />;

  else if (!record) {
    throw new Error("record is undefined in RecordDetailsRead");
  }

  return (
    <ThemedView>
      <RecordDetailsBeforeSleepCard guid={guid} />
      <DuringSleepSection record={record} />
    </ThemedView>
  );
}
