import DeleteDailyLogsSection from "@/src/components/listSections/settings/DeleteDailyLogsSection";
import RevokePermissionsSection from "@/src/components/listSections/settings/RevokePermissionsSection";
import SignOutSection from "@/src/components/listSections/settings/SignOutSection";
import ThemedView from "@/src/components/ThemedView";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { getGrantedPermissions } from "react-native-health-connect";
import { Button, Dialog, Divider, Portal, Text } from "react-native-paper";

export default function SettingsScreen() {
  const [hasHealthConnectPermissions, setHasHealthConnectPermissions] = useState(false);
  const [dialogMsg, setDialogMsg] = useState<string | undefined>();
  const [dialogIsVisible, setDialogIsVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getGrantedPermissions()
        .then((data) => setHasHealthConnectPermissions(data.length !== 0))
        .catch(() => {
          throw new Error(
            "Could not fetch granted permissions from Health Connect."
          );
        });
    }, [])
  );

  const showDialogMsg = (msg: string): void => {
    setDialogMsg(msg);
    setDialogIsVisible(true);
  };

  return (
    <ThemedView>
      <Divider />
      <RevokePermissionsSection
        hasHealthConnectPermissions={hasHealthConnectPermissions}
        showDialogMsg={showDialogMsg}
      />
      <Divider />

      <DeleteDailyLogsSection />
      <Divider />

      <SignOutSection />
      <Divider />

      <Portal>
        <Dialog
          visible={dialogIsVisible}
          onDismiss={() => setDialogIsVisible(false)}
        >
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{dialogMsg}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogIsVisible(false)}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ThemedView>
  );
}