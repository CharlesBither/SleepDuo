import { useLocalSearchParams } from "expo-router";
import ThemedView from "../components/ThemedView";
import { readRecord } from "react-native-health-connect";
import { useState } from "react";
import LoadingScreen from "./LoadingScreen";
import { SleepRecord } from "../records/SleepRecord";
import DuringSleepSection from "../components/listSections/RecordDetails/DuringSleepSection";
import BeforeSleepReadSection from "../components/listSections/RecordDetails/BeforeSleepReadSection";

export default function RecordDetailsRead() {
  const { guid } = useLocalSearchParams<{ guid: string }>();

  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<SleepRecord | undefined>(undefined);

  readRecord("SleepSession", guid)
  .then(healthConnectRecord => {
    setRecord(new SleepRecord(healthConnectRecord));
    setLoading(false);
  })

  if (loading) return <LoadingScreen />;
  
  else if (!record) {
    throw new Error("record is undefined in RecordDetailsRead");
  }

  return (
    <ThemedView>
      <BeforeSleepReadSection guid={guid} />
      <DuringSleepSection record={record} />
    </ThemedView>
  );
}
