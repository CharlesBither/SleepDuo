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
import { useFocusEffect, useRouter } from "expo-router";
import { initRecordDetailsMap } from "@/src/database/recordDetails";
import OverviewContainer from "@/src/views/Overview";
import OverviewExploreCard from "@/src/components/cards/OverviewExploreCard";
import { setErrorMsg } from "@/src/stores/error";

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
  const router = useRouter();

  useEffect(() => {
    /** Gets required permissions from health-connect */
    initHealthConnect()
      .then(async () => await handleInitHealthConnectSuccess())
      .catch((error) =>  renderErrorScreen(error));
    
      // initialize the journalRecordsMap for the logged in user
    getId()
      .then((id) => initRecordDetailsMap(id))
      .catch((error: any) => renderErrorScreen(error));
  }, [])

  const renderErrorScreen = (error: any): void => {
    setErrorMsg(error);
    router.replace("/ErrorScreen");
  }

  const handleInitHealthConnectSuccess = async () => {
    try {
      await checkForPermissions();
    } catch (error) {
      renderErrorScreen(error);
    }
    setLoading(false);
  };

  /** updates setHasHealthConnectPermissions if SleepDuo has the necessary Health Connect permissions */
  const checkForPermissions = async () => {
    try {
      const grantedPermissions = await getGrantedPermissions();
      if (hasRequiredPermissions(grantedPermissions)) {
        setHasHealthConnectPermissions(true);
      }
    } catch (error) {
      renderErrorScreen(error);
    }
  };

  /** Called when the user clicks the RequestPermissionCard button */
  const handleRequestButtonPress = async (): Promise<void> => {
    try {
      setLoading(true);
      setRequestedPermissions(true);
      await requestSleepPermissions();
      await checkForPermissions();
      setLoading(false);
    } catch (error) {
      renderErrorScreen(error);
    }
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
