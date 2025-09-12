import { useCallback, useEffect, useState } from "react";

import {
  hasRequiredPermissions,
  initHealthConnect,
  requestSleepPermissions,
} from "@/src/lib/health-connect/initialize";
import ThemedView from "@/src/views/ThemedView";
import { getId } from "@/src/database/auth";
import { getGrantedPermissions } from "react-native-health-connect";
import LoadingScreen from "../LoadingScreen";
import ManualPermissionCard from "@/src/components/cards/ManualPermissionCard";
import RequestPermissionCard from "@/src/components/cards/RequestPermissionCard";
import { useFocusEffect } from "expo-router";
import { initRecordDetailsMap } from "@/src/database/recordDetails";
import OverviewContainer from "@/src/views/Overview";
import OverviewExploreCard from "@/src/components/cards/OverviewExploreCard";

/**
 * This component is shown after the user is authenticated.
 * Connects to the health-connect api and gets sleep data from the
 * last 14 days.
 *
 * @returns View element containing average total sleep time and efficiency
 */
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [hasHealthConnectPermissions, setHasHealthConnectPermissions] =
    useState(false);
  const [requestedPermissions, setRequestedPermissions] = useState(false);

  useEffect(() => {
    /** Gets required permissions from health-connect */
    initHealthConnect()
      .then(async () => await handleInitHealthConnectSuccess())
      .catch(() => {
        throw new Error("could not intialize health connect");
      });
    
      // initialize the journalRecordsMap for the logged in user
    getId().then((id) => initRecordDetailsMap(id));
  }, [])

  const handleInitHealthConnectSuccess = async () => {
    await checkForPermissions();
    setLoading(false);
  };

  /** updates setHasHealthConnectPermissions if SleepDuo has the necessary Health Connect permissions */
  const checkForPermissions = async () => {
    const grantedPermissions = await getGrantedPermissions();
    if (hasRequiredPermissions(grantedPermissions)) {
      setHasHealthConnectPermissions(true);
    }
  };

  /** Called when the user clicks the RequestPermissionCard button */
  const handleRequestButtonPress = async (): Promise<void> => {
    setLoading(true);
    setRequestedPermissions(true);
    await requestSleepPermissions();
    await checkForPermissions();
    setLoading(false);
  };

  /** Checks if the user has the necessary Health Connect permissions whenever the screen is focused */
  useFocusEffect(
    useCallback(() => {
      if (!hasHealthConnectPermissions) {
        setLoading(true);
        checkForPermissions();
        setLoading(false);
      }
    }, [])
  );

  if (loading) {
    return <LoadingScreen />;
  } else if (!hasHealthConnectPermissions && requestedPermissions) {
    return (
      <ThemedView>
        <ManualPermissionCard />
      </ThemedView>
    );
  } else if (!hasHealthConnectPermissions) {
    return (
      <ThemedView>
        <RequestPermissionCard
          requestButtonCallback={handleRequestButtonPress}
        />
      </ThemedView>
    );
  }
  return (
    <ThemedView>
      <OverviewContainer />
      <OverviewExploreCard />
    </ThemedView>
  );
}
