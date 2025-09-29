import {
  ActivityIndicator,
  Button,
  Dialog,
  List,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { getId } from '@/src/lib/supabase';
import { deleteAllSleepSessionLogsById } from '@/src/database/sleepSessionLogs';
import { setErrorMsg } from '@/src/stores/error';
import { useRouter } from 'expo-router';

export default function DeleteDailyLogsSection() {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDialogIsVisible, setConfirmDialogIsVisible] = useState(false);
  const [successDialogIsVisible, setSuccessDialogIsVisible] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  /** Deletes all journal entries that the user created */
  const handleDeleteDailyLogsPress = async (): Promise<void> => {
    try {
      setDeleteLoading(true);
      const uuid = await getId();
      await deleteAllSleepSessionLogsById(uuid);
      setDeleteLoading(false);
      setConfirmDialogIsVisible(false);
      setSuccessDialogIsVisible(true);
    } catch (e) {
      setErrorMsg('handleDeleteDailyLogsPress threw error: ' + e);
      router.replace('/ErrorScreen');
    }
  };

  return (
    <List.Section>
      <List.Subheader>Daily logs</List.Subheader>
      <Text style={{ ...styles.margin, color: theme.colors.outline }}>
        Delete all of your daily logs.
      </Text>

      <Button
        mode="contained"
        style={{
          ...styles.margin,
          backgroundColor: theme.colors.errorContainer,
        }}
        onPress={() => setConfirmDialogIsVisible(true)}
      >
        <Text style={{ color: theme.colors.onErrorContainer }}>
          Delete all daily logs
        </Text>
      </Button>

      <Portal>
        <Dialog
          visible={confirmDialogIsVisible}
          onDismiss={() => setConfirmDialogIsVisible(false)}
        >
          <Dialog.Title>Confirm</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to permanently delete all your daily logs?
              This will not delete any data provided by Health Connect.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmDialogIsVisible(false)}>
              Cancel
            </Button>

            {deleteLoading ? (
              <Button
                style={{
                  ...styles.margin,
                  paddingHorizontal: 5,
                  backgroundColor: theme.colors.errorContainer,
                }}
              >
                <ActivityIndicator />
              </Button>
            ) : (
              <Button
                mode="contained"
                style={{
                  ...styles.margin,
                  paddingHorizontal: 5,
                  backgroundColor: theme.colors.errorContainer,
                }}
                textColor={theme.colors.onErrorContainer}
                onPress={handleDeleteDailyLogsPress}
              >
                Delete
              </Button>
            )}
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog
          visible={successDialogIsVisible}
          onDismiss={() => setSuccessDialogIsVisible(false)}
        >
          <Dialog.Title>Success</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Your daily logs have been deleted.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setSuccessDialogIsVisible(false)}>
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </List.Section>
  );
}

const styles = StyleSheet.create({
  margin: {
    marginHorizontal: 15,
    marginBottom: 5,
  },
});
