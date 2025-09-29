import {
  ActivityIndicator,
  Button,
  Dialog,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';
import { useState } from 'react';
import { getId } from '@/src/lib/supabase';
import {
  deleteSleepSessionLog,
  getSleepSessionLog,
} from '@/src/database/sleepSessionLogs';
import { View } from 'react-native';
import { SleepSessionLog } from '@/src/types/SleepSessionLog';

type SleepSessionLogDeleteButtonProps = {
  guid: string;
  setLog: (log?: SleepSessionLog) => void;
};

export default function SleepSessionLogDeleteButton(
  props: SleepSessionLogDeleteButtonProps
) {
  const theme = useTheme();

  const [visible, setVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleYesPress = async (): Promise<void> => {
    setDeleteLoading(true);
    const id = await getId();
    await deleteSleepSessionLog(id, props.guid);
    setDeleteLoading(false);
    props.setLog(getSleepSessionLog(props.guid));
    setVisible(false);
  };

  return (
    <View>
      <Button
        theme={{ colors: { primary: theme.colors.error } }}
        onPress={showDialog}
      >
        Delete
      </Button>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Confirmation</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete this log?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            {deleteLoading ? (
              <Button>
                <ActivityIndicator />
              </Button>
            ) : (
              <Button onPress={handleYesPress}>Yes</Button>
            )}
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
