import {
  ActivityIndicator,
  Button,
  List,
  Text,
  useTheme,
} from "react-native-paper";
import { StyleSheet } from "react-native";
import { useState } from "react";
import { getId } from "@/src/database/auth";
import { deleteAllJournalRecordsById, journalRecordsMap } from "@/src/database/journal_records";

type DeleteJournalSectionProps = {
  showDialogMsg: (msg: string) => void;
}

export default function DeleteJournalSection(props: DeleteJournalSectionProps) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const theme = useTheme();

  /** Deletes all journal entries that the user created */
  const handleDeleteJournalEntriesPress = async (): Promise<void> => {
    setDeleteLoading(true);
    const uuid = await getId();
    await deleteAllJournalRecordsById(uuid);
    journalRecordsMap.clear();
    setDeleteLoading(false);
    props.showDialogMsg("Your journal entries have been deleted");
  };

  return (
    <List.Section>
      <List.Subheader>Journal entries</List.Subheader>
      <Text style={{ ...styles.margin, color: theme.colors.outline }}>
        Delete all of your journal entries.
      </Text>

      {deleteLoading ? (
        <Button
          mode="contained"
          style={{
            ...styles.margin,
            backgroundColor: theme.colors.errorContainer,
          }}
        >
          <ActivityIndicator color={theme.colors.onErrorContainer} />
        </Button>
      ) : (
        <Button
          mode="contained"
          style={{
            ...styles.margin,
            backgroundColor: theme.colors.errorContainer,
          }}
          onPress={handleDeleteJournalEntriesPress}
        >
          <Text style={{ color: theme.colors.onErrorContainer }}>
            Delete all Journal entries
          </Text>
        </Button>
      )}
    </List.Section>
  );
}

const styles = StyleSheet.create({
  margin: {
    marginHorizontal: 15,
    marginBottom: 5,
  },
});
