import { List, Text, useTheme } from 'react-native-paper';
import RevokePermissionsButton from '../../buttons/RevokePermissionsButton';
import { StyleSheet } from 'react-native';

type RevokePermissionsSectionProps = {
  hasHealthConnectPermissions: boolean;
  showDialogMsg: (msg: string) => void;
};

export default function RevokePermissionsSection(
  props: RevokePermissionsSectionProps
) {
  const theme = useTheme();

  return (
    <List.Section>
      <List.Subheader>Health Connect permissions</List.Subheader>

      {props.hasHealthConnectPermissions ? (
        <Text style={{ ...styles.margin, color: theme.colors.outline }}>
          SleepDuo currently has permissions to Health Connect data.
        </Text>
      ) : (
        <Text style={{ ...styles.margin, color: theme.colors.outline }}>
          SleepDuo doesn't have permissions to Health Connect data.
        </Text>
      )}

      <RevokePermissionsButton
        hasHealthConnectPermissions={props.hasHealthConnectPermissions}
        showDialogMsg={props.showDialogMsg}
      />
    </List.Section>
  );
}

const styles = StyleSheet.create({
  margin: {
    marginHorizontal: 15,
    marginBottom: 5,
  },
});
