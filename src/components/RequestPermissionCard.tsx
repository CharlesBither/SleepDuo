import { Card, Text, Button } from "react-native-paper";
import { StyleSheet } from "react-native";

type RequestPermissionCardProps = {
    requestButtonCallback: () => Promise<void>;
}

/** Card component that allows the user to press a button to request necessary permissions from Health Connect */
export default function RequestPermissionCard(props: RequestPermissionCardProps) {
    return (
      <Card style={{...styles.card }}>
        <Card.Content>
          <Text variant="titleMedium" style={{ ...styles.cardTitle }}>
            Get more detailed sleep information
          </Text>
          <Text variant="bodyMedium" style={{ ...styles.cardContent }}>
            Keep SleepDuo updated with the latest sleep data from your other apps.
          </Text>
          <Button mode="contained" onPress={async () => await props.requestButtonCallback()} style={styles.button}>Set up Health Connect</Button>
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