import { Card, Text } from "react-native-paper";
import { StyleSheet } from "react-native";

/**
 * Card component that tells the user how to allow Health Connect permissions in settings.
 * This is shown if the user denys permissions when clicking the button in the RequestPermissionCard component.
 */
export default function ManualPermissionCard() {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Go to settings to enable Health Connect access
          </Text>
          <Text variant="bodyMedium" style={styles.cardContent}>
            You can give SleepDuo access to your sleep data from other apps by going to Connected Apps in Health Connect settings.
          </Text>
        </Card.Content>
      </Card>
    )
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
    alignItems: "flex-start",
    alignSelf: "flex-start"
  },
})
