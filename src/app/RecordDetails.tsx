import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native-paper";
import ThemedView from "../components/ThemedView";
import { readRecord } from "react-native-health-connect";
import { useState } from "react";
import LoadingScreen from "./LoadingScreen";
import { SleepRecord } from "../records/SleepRecord";
import { getId } from "../database/auth";

export default function RecordDetails() {
  const { guid } = useLocalSearchParams<{ guid: string }>();

  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<SleepRecord | undefined>(undefined);
  const [details, setDetails] = useState();

  const getSleepRecord = async (): Promise<void> => {
    const uuid = await getId();
    const healthConnectRecord = await readRecord("SleepSession", guid);
    setRecord(new SleepRecord(healthConnectRecord));
  }

  

  if (loading) return <LoadingScreen />

  return <ThemedView><Text>{guid}</Text></ThemedView>
}