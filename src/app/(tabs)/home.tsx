import { useCallback, useState } from "react";
import { List } from "react-native-paper";

import { hasRequiredPermissions, initHealthConnect, requestSleepPermissions } from "@/src/health-connect/initialize";
import { getLast14Days } from "@/src/health-connect/sleep-data";
import { SleepRecord } from "@/src/records/SleepRecord";
import { SleepDuoRecord } from "@/src/records/SleepDuoRecord";
import { DateFormatter } from "@/src/utils/DateFormatter";
import ThemedView from "@/src/components/ThemedView";
import { ReadRecordsResult } from "react-native-health-connect";
import { getId } from "@/src/database/auth";
import { fetchJournalRecordsByUuid, populateJournalRecordsMap } from "@/src/database/journal_records";
import { getGrantedPermissions } from 'react-native-health-connect';
import LoadingScreen from "../LoadingScreen";
import ManualPermissionCard from "@/src/components/ManualPermissionCard";
import RequestPermissionCard from "@/src/components/RequestPermissionCard";
import { useFocusEffect } from "expo-router";

/**
 * This component is shown after the user is authenticated.
 * Connects to the health-connect api and gets sleep data from the
 * last 14 days.
 *
 * @returns View element containing average total sleep time and efficiency
 */
export default function Home() {
  const [sleepArray, setSleepArray] = useState<SleepDuoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasHealthConnectPermissions, setHasHealthConnectPermissions] = useState(false);
  const [requestedPermissions, setRequestedPermissions] = useState(false);

    // initialize the journalRecordsMap for the logged in user
  const uuid = getId()
    .then((id) => fetchJournalRecordsByUuid(id)
      .then((data) => populateJournalRecordsMap(data)));

  /** Average total sleep time over the last 14 days */
  const currAverageTST = SleepRecord.getAverageTST(sleepArray);
  const averageTSTDescription =
    DateFormatter.getHours(currAverageTST) +
    "h " +
    DateFormatter.getMinutes(currAverageTST) +
    "m";

    /** updates setHasHealthConnectPermissions if SleepDuo has the necessary Health Connect permissions */
  const checkForPermissions = async () => {
    const grantedPermissions = await getGrantedPermissions();
    if (hasRequiredPermissions(grantedPermissions)) {
      getSleepRecords();
      setHasHealthConnectPermissions(true);
    }
  }

  const handleInitHealthConnectSuccess = async () => {
    await checkForPermissions();
    setLoading(false);
  }

  /** Gets required permissions from health-connect */
  initHealthConnect()
    .then(async () => await handleInitHealthConnectSuccess())
    .catch(() => { throw new Error("could not intialize health connect") })

  /** Gets ReadRecordsResult<"SleepSession"> from last 14 days */
  const getSleepRecords = (): void => {
    getLast14Days()
      .then((data) => initSleepArray(data))
      .catch(() => console.log("could not get sleep data"));
  };

  /**
   * Creates a list of SleepRecords and assigns to sleepArray.
   * @param data ReadRecordsResult<"SleepSession"> containing 14 days of sleep data.
   */
  const initSleepArray = (data: ReadRecordsResult<"SleepSession">): void => {
    let arr: SleepDuoRecord[] = [];
    const records = data.records;
    for (let i = 0; i < records.length; i++) {
      const currSleepActivity = new SleepRecord(records[i]);
      arr.push(currSleepActivity);
    }

    if (arr.length != sleepArray.length && arr.length !== 0) {
      setSleepArray(arr);
    }
  };

  /** Called when the user clicks the RequestPermissionCard button */
  const handleRequestButtonPress = async (): Promise<void> => {
    setLoading(true);
    setRequestedPermissions(true)
    await requestSleepPermissions();
    await checkForPermissions();
    setLoading(false);
  }

  /** Checks if the user has the necessary Health Connect permissions whenever the screen is focused */
  useFocusEffect(
    useCallback(() => {
      if (!hasHealthConnectPermissions) {
        setLoading(true);
        checkForPermissions();
        setLoading(false);
      }
    }, [])
  )

  if (loading) {
    return <LoadingScreen />
  } else if (!hasHealthConnectPermissions && requestedPermissions) {
    return (
      <ThemedView>
        <ManualPermissionCard />
      </ThemedView>
    )
  } else if (!hasHealthConnectPermissions) {
    return (
      <ThemedView>
        <RequestPermissionCard requestButtonCallback={handleRequestButtonPress} />
      </ThemedView>
    )
  }
  return (
    <ThemedView>
      <List.Section>
        <List.Subheader>Last 14 days</List.Subheader>
        <List.Item
          title="Total Sleep Time"
          description={averageTSTDescription}
        />
      </List.Section>
    </ThemedView>
  );
}
