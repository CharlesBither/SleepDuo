import {
  Card,
  Text,
  Button,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useState } from 'react';

type RequestPermissionCardProps = {
  requestButtonCallback: () => Promise<void>;
};

/** Card component that allows the user to press a button to request necessary permissions from Health Connect */
export default function RequestPermissionCard(
  props: RequestPermissionCardProps
) {
  const [requestLoading, setRequestLoading] = useState(false);
  const theme = useTheme();

  const handleRequestButtonPress = async (): Promise<void> => {
    setRequestLoading(true);
    await props.requestButtonCallback();
  };

  const renderButton = (): JSX.Element => {
    if (requestLoading) {
      return (
        <Button mode="contained" style={styles.button}>
          <ActivityIndicator color={theme.colors.inversePrimary} />
        </Button>
      );
    }
    return (
      <Button
        mode="contained"
        onPress={handleRequestButtonPress}
        style={styles.button}
      >
        Set up Health Connect
      </Button>
    );
  };

  return (
    <Card style={{ ...styles.card }}>
      <Card.Content>
        <Text variant="titleMedium" style={{ ...styles.cardTitle }}>
          Get more detailed sleep information
        </Text>
        <Text variant="bodyMedium" style={{ ...styles.cardContent }}>
          Keep SleepDuo updated with the latest sleep data from your other apps.
        </Text>
        {renderButton()}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    marginTop: 10,
  },
  cardTitle: {
    fontWeight: 600,
  },
  card: {
    marginHorizontal: 20,
  },
  button: {
    marginTop: 20,
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
});
