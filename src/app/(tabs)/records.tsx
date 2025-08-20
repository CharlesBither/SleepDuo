import { useCallback, useState } from "react";
import { Text } from "react-native-paper";

import { SleepDuoRecord } from "@/src/records/SleepDuoRecord";
import { hasRequiredPermissions, initHealthConnect } from "@/src/health-connect/initialize";
import { getLast14Days } from "@/src/health-connect/sleep-data";
import { SleepRecord } from "@/src/records/SleepRecord";
import RecordsList from "@/src/components/RecordsList";
import ThemedView from "@/src/components/ThemedView";
import { getGrantedPermissions, ReadRecordsResult } from "react-native-health-connect";
import LoadingScreen from "../LoadingScreen";
import GoHomePermissionCard from "@/src/components/GoHomePermissionCard";
import { useFocusEffect } from "expo-router";

/**
 * Gets the last 14 days of sleep records and renders it's information
 * for the user as a list.
 *
 * @returns View containing a list of sleep records and their descriptions
 */
export default function RecordsScreen() {

  const [recordsArray, setRecordsArray] = useState<SleepDuoRecord[]>([]);
  const [hasHealthConnectPermissions, setHasHealthConnectPermissions] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleInitHealthConnectSuccess = async () => {
    setLoading(true);
    const grantedPermissions = await getGrantedPermissions();
    if (hasRequiredPermissions(grantedPermissions)) {
      const data = await getLast14Days();
      initializeRecordsArray(data);
      setHasHealthConnectPermissions(true);
    }
    setLoading(false);
  }

  /**
   * Creates a list of SleepRecords and assigns to recordsArray.
   * @param data ReadRecordsResult<"SleepSession"> containing 14 days of sleep data.
   */
  const initializeRecordsArray = (data: ReadRecordsResult<"SleepSession">): void => {
    let arr: SleepDuoRecord[] = [];

    const records = data.records;
    for (let i = 0; i < records.length; i++) {
      const currSleepActivity = new SleepRecord(records[i]);
      arr.push(currSleepActivity);
    }

    if (arr.length != recordsArray.length) {
      setRecordsArray(arr);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!hasHealthConnectPermissions) {
        initHealthConnect()
          .then(async () => await handleInitHealthConnectSuccess())
          .catch(() => { throw new Error("could not intialize health connect") })
      }
    }, [])
  )

  if (loading) {
    return <LoadingScreen />
  }
  else if (!hasHealthConnectPermissions) {
    return (
      <ThemedView>
        <GoHomePermissionCard />
      </ThemedView>
    )
  }
  else if (recordsArray) {
    return (
      <ThemedView>
        <RecordsList recordArray={recordsArray} />
      </ThemedView>
    );
  }
  return (
    <ThemedView>
      <Text>You do not have any sleep records to display.</Text>
    </ThemedView>
  );
}
