import { useLocalSearchParams, useRouter } from 'expo-router';
import ThemedView from '../views/ThemedView';
import { useEffect, useState } from 'react';
import { SleepSession } from '../types/SleepSession';
import DuringSleepSection from '../components/listSections/sessions/DuringSleepSection';
import SleepSessionLogCard from '../components/cards/SleepSessionLogCard';
import { getSleepSessionFromReadRecord } from '../utils/sleepSession';
import { setErrorMsg } from '../stores/error';
import LoadingScreen from '../views/LoadingScreen';

export default function SleepSessionLogRead() {
  const { guid } = useLocalSearchParams<{ guid: string }>();

  const [loading, setLoading] = useState(true);
  const [log, setLog] = useState<SleepSession | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    getSleepSessionFromReadRecord(guid)
      .then((sleepSessionLog) => {
        setLog(sleepSessionLog);
        setLoading(false);
      })
      .catch((e) => {
        setErrorMsg('readRecord threw error: ' + e);
        router.replace('/ErrorScreen');
      });
  }, [guid, router]);

  if (loading) return <LoadingScreen />;
  else if (!log) {
    setErrorMsg('record is undefined in SleepSessionLogRead');
    router.replace('/ErrorScreen');
    return;
  }

  return (
    <ThemedView>
      <SleepSessionLogCard guid={guid} />
      <DuringSleepSection record={log} />
    </ThemedView>
  );
}
