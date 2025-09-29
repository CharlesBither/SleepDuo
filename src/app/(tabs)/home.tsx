import { useCallback, useEffect, useState } from 'react';

import {
  hasRequiredPermissions,
  requestSleepPermissions,
} from '@/src/lib/healthConnectInitialize';
import ThemedView from '@/src/views/ThemedView';
import { getGrantedPermissions } from 'react-native-health-connect';
import ManualPermissionCard from '@/src/components/cards/ManualPermissionCard';
import RequestPermissionCard from '@/src/components/cards/RequestPermissionCard';
import { useFocusEffect, useRouter } from 'expo-router';
import { initSleepSessionLogsMap } from '@/src/database/sleepSessionLogs';
import Overview from '@/src/views/Overview';
import { setErrorMsg } from '@/src/stores/error';
import LoadingScreen from '@/src/views/LoadingScreen';

/**
 * This component is shown after the user is authenticated.
 * Connects to the health-connect api and renders the Overview page if
 * this app has been granted the required permissions.
 */
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [hasHealthConnectPermissions, setHasHealthConnectPermissions] =
    useState(false);
  const [pressedRequestButton, setPressedRequestButton] = useState(false); // track whether the user already attempted to request permissions.
  const router = useRouter();

  /** Redirects user to an error screen that displays the given error */
  const renderErrorScreen = useCallback(
    (error: any): void => {
      setErrorMsg(error);
      router.replace('/ErrorScreen');
    },
    [router]
  );

  /** updates hasHealthConnectPermissions state */
  const checkForPermissions = useCallback(async (): Promise<void> => {
    getGrantedPermissions()
      .then((grantedPermissions) =>
        setHasHealthConnectPermissions(
          hasRequiredPermissions(grantedPermissions)
        )
      )
      .catch((error) => renderErrorScreen(error));
  }, [renderErrorScreen]);

  /** Called when the user clicks the RequestPermissionCard button */
  const handleRequestButtonPress = async (): Promise<void> => {
    try {
      await requestSleepPermissions();
      await checkForPermissions();
      setPressedRequestButton(true);
    } catch (error) {
      renderErrorScreen(error);
    }
  };

  useEffect(() => {
    const checkForPermissionsPromise = checkForPermissions();

    // initialize the journalRecordsMap for the logged in user
    const getIdPromise = initSleepSessionLogsMap().catch((error) =>
      renderErrorScreen(error)
    );

    Promise.all([getIdPromise, checkForPermissionsPromise]).then(() =>
      setLoading(false)
    );
  }, [checkForPermissions, renderErrorScreen]);

  /** Checks if the user has the necessary Health Connect permissions whenever the screen is focused */
  useFocusEffect(
    useCallback(() => {
      if (!hasHealthConnectPermissions) checkForPermissions();
    }, [checkForPermissions, hasHealthConnectPermissions])
  );

  if (loading) {
    return <LoadingScreen />;
  } else if (!hasHealthConnectPermissions && pressedRequestButton) {
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
      <Overview />
    </ThemedView>
  );
}
