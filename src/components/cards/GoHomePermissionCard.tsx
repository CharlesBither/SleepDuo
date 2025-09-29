import { Card, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';

/**
 * Card component that tells the user to go to the home screen to update permissions.
 */
export default function GoHomePermissionCard() {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.cardTitle}>
          Insufficient Health Connect permissions
        </Text>
        <Text variant="bodyMedium" style={styles.cardContent}>
          To see your sleep records, you must allow Health Connect permissions.
          Go to the Home screen to allow SleepDuo access to Health Connect.
        </Text>
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
