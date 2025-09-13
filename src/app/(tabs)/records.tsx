import { useCallback, useState } from "react";
import { Text } from "react-native-paper";

import { SleepRecord } from "@/src/types/SleepRecord";
import { hasRequiredPermissions, initHealthConnect } from "@/src/lib/health-connect/initialize";
import { getLast14Days } from "@/src/lib/health-connect/sleep-data";
import RecordsList from "@/src/components/listSections/RecordsList";
import ThemedView from "@/src/views/ThemedView";
import { getGrantedPermissions, ReadRecordsResult } from "react-native-health-connect";
import LoadingScreen from "../LoadingScreen";
import GoHomePermissionCard from "@/src/components/cards/GoHomePermissionCard";
import { useFocusEffect, useRouter } from "expo-router";
import { constructSleepRecord } from "@/src/utils/SleepRecord";
import { setErrorMsg } from "@/src/stores/error";

/**
 * Gets the last 14 days of sleep records and renders it's information
 * for the user as a list.
 *
 * @returns View containing a list of sleep records and their descriptions
 */
export default function RecordsScreen() {

  const [recordsArray, setRecordsArray] = useState<SleepRecord[]>([]);
  const [hasHealthConnectPermissions, setHasHealthConnectPermissions] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      if (!hasHealthConnectPermissions) {
        initHealthConnect()
          .then(async () => await handleInitHealthConnectSuccess())
          .catch((e) => { 
            setErrorMsg("Could not intialize health connect. Make sure you have the health connect app installed on your device. " + e);
            router.replace("/ErrorScreen");
          })
      }
    }, [])
  )

  const handleInitHealthConnectSuccess = async () => {
    try {
      const grantedPermissions = await getGrantedPermissions();
      if (hasRequiredPermissions(grantedPermissions)) {
        const data = await getLast14Days();
        initializeRecordsArray(data);
        setHasHealthConnectPermissions(true);
      }
      setLoading(false);
    }
    catch (e) {
      setErrorMsg("handleInitHealthConnectSuccess threw error: " + e);
      router.replace("/ErrorScreen");
    }
  }

  /**
   * Creates a list of SleepRecords and assigns to recordsArray.
   * @param data ReadRecordsResult<"SleepSession"> containing 14 days of sleep data.
   */
  const initializeRecordsArray = (data: ReadRecordsResult<"SleepSession">): void => {
    let arr: SleepRecord[] = [];

    const records = data.records;
    for (let i = 0; i < records.length; i++) {
      const currSleepActivity = constructSleepRecord(records[i]);
      arr.push(currSleepActivity);
    }

    if (arr.length != recordsArray.length) {
      setRecordsArray(arr);
    }
  };

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
