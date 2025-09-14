import { ActivityIndicator, Button, Dialog, Portal, Text, useTheme } from "react-native-paper";
import { useState } from "react";
import { getId } from "@/src/lib/supabase";
import { deleteRecordDetails, getRecordDetails } from "@/src/database/recordDetails";
import { View } from "react-native";
import { RecordDetails } from "@/src/types/RecordDetails";

type RecordDetailsDeleteButtonProps = {
  guid: string;
  setDetails: (details?: RecordDetails) => void;
}

export default function RecordDetailsDeleteButton(props: RecordDetailsDeleteButtonProps) {
  const theme = useTheme();

  const [visible, setVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleYesPress = async (): Promise<void> => {
    setDeleteLoading(true);
    const id = await getId();
    await deleteRecordDetails(id, props.guid);
    setDeleteLoading(false);
    props.setDetails(getRecordDetails(props.guid));
    setVisible(false);
  }

  return (
    <View>
      <Button theme={{ colors: { primary: theme.colors.error } }} onPress={showDialog}>Delete</Button>
      <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Confirmation</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">Are you sure you want to delete these details?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Cancel</Button>
              {deleteLoading ? <Button><ActivityIndicator /></Button> : <Button onPress={handleYesPress}>Yes</Button>}
            </Dialog.Actions>
          </Dialog>
        </Portal>
    </View>
  )
}