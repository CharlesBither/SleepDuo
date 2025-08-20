import { StyleSheet } from "react-native";
import { revokeAllPermissions } from "react-native-health-connect";
import { Button } from "react-native-paper";

type RevokePermissionsButtonProps = {
  hasHealthConnectPermissions: boolean;
  showDialogMsg: (msg: string) => void;
}

export default function RevokePermissionsButton(props: RevokePermissionsButtonProps) {

  const handlePress = async (): Promise<void> => {
    revokeAllPermissions();
    props.showDialogMsg("Please restart the app to finish revoking SleepDuo's access to Health Connect permissions.")
  }
  
  if (props.hasHealthConnectPermissions) {
    return <Button mode="contained" onPress={async () => await handlePress()} style={styles.margin}>Revoke permissions</Button>;
  }
  return <Button disabled={true} style={styles.margin} >Revoke permissions</Button>;
}

const styles = StyleSheet.create({
  margin: {
    marginHorizontal: 15,
  }
})
