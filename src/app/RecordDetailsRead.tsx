import { useLocalSearchParams, useRouter } from "expo-router";
import ThemedView from "../views/ThemedView";
import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import { SleepSession } from "../types/SleepSession";
import DuringSleepSection from "../components/listSections/RecordDetails/DuringSleepSection";
import RecordDetailsCard from "../components/cards/RecordDetailsCard";
import { getSleepSessionFromReadRecord } from "../utils/sleepSession";
import { setErrorMsg } from "../stores/error";

export default function RecordDetailsRead() {
  const { guid } = useLocalSearchParams<{ guid: string }>();

  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<SleepSession | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    getSleepSessionFromReadRecord(guid)
      .then(sleepRecord => {
        setRecord(sleepRecord);
        setLoading(false);
      })
      .catch(e => {
        setErrorMsg("readRecord threw error: " + e);
        router.replace("/ErrorScreen");
      })
  }, []);

  if (loading) return <LoadingScreen />;

  else if (!record) {
    setErrorMsg("record is undefined in RecordDetailsRead");
    router.replace("/ErrorScreen");
    return;
  }

  return (
    <ThemedView>
      <RecordDetailsCard guid={guid} />
      <DuringSleepSection record={record} />
    </ThemedView>
  );
}
