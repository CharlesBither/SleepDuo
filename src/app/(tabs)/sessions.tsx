import { useCallback, useState } from 'react';
import { Text } from 'react-native-paper';

import { SleepSession } from '@/src/types/SleepSession';
import { hasRequiredPermissions } from '@/src/lib/healthConnectInitialize';
import { getBeforeNow } from '@/src/lib/healthConnectSleepData';
import RecordsList from '@/src/components/listSections/RecordsList';
import ThemedView from '@/src/views/ThemedView';
import {
  getGrantedPermissions,
  ReadRecordsResult,
} from 'react-native-health-connect';
import GoHomePermissionCard from '@/src/components/cards/GoHomePermissionCard';
import { useFocusEffect, useRouter } from 'expo-router';
import { constructSleepSession } from '@/src/utils/sleepSession';
import { setErrorMsg } from '@/src/stores/error';
import { HealthConnectPermission } from '@/src/types/HealthConnectPermission';
import LoadingScreen from '@/src/views/LoadingScreen';

/**
 * Gets all sleep records and renders it's information for the user as a list.
 *
 * @returns View containing a list of sleep records and their descriptions
 */
export default function SessionsScreen() {
  const [sessionsArray, setSessionsArray] = useState<SleepSession[]>([]);
  const [hasHealthConnectPermissions, setHasHealthConnectPermissions] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /**
   * Creates a list of SleepRecords and updates recordsArray state.
   * @param data - ReadRecordsResult<"SleepSession"> containing sleep data.
   */
  const initializeRecordsArray = useCallback(
    (data: ReadRecordsResult<'SleepSession'>): void => {
      let arr: SleepSession[] = [];
      const records = data.records;
      for (let i = 0; i < records.length; i++) {
        const currSleepActivity = constructSleepSession(records[i]);
        arr.push(currSleepActivity);
      }
      if (arr.length !== sessionsArray.length) {
        setSessionsArray(arr);
      }
    },
    [sessionsArray.length]
  );

  useFocusEffect(
    useCallback(() => {
      const handleGetGrantedPermissionsPromise = async (
        grantedPermissions: HealthConnectPermission[]
      ) => {
        try {
          if (hasRequiredPermissions(grantedPermissions)) {
            const data = await getBeforeNow();
            initializeRecordsArray(data);
            setHasHealthConnectPermissions(true);
          }
          setLoading(false);
        } catch (error) {
          setErrorMsg(
            'An unexpected error occurred while trying to get sleep data at handleGetGrantedPermissionsPromise: ' +
              error
          );
          router.replace('/ErrorScreen');
        }
      };

      if (!hasHealthConnectPermissions) {
        getGrantedPermissions()
          .then(
            async (grantedPermissions) =>
              await handleGetGrantedPermissionsPromise(grantedPermissions)
          )
          .catch((e) => {
            setErrorMsg(
              'An unexpected error occured at getGrantedPermissions: ' + e
            );
            router.replace('/ErrorScreen');
          });
      }
    }, [router, hasHealthConnectPermissions, initializeRecordsArray])
  );

  if (loading) {
    return <LoadingScreen />;
  } else if (!hasHealthConnectPermissions) {
    return (
      <ThemedView>
        <GoHomePermissionCard />
      </ThemedView>
    );
  } else if (sessionsArray) {
    return (
      <ThemedView>
        <RecordsList recordArray={sessionsArray} />
      </ThemedView>
    );
  }
  return (
    <ThemedView>
      <Text>You do not have any sleep records to display.</Text>
    </ThemedView>
  );
}
