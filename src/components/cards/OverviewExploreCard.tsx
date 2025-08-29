import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { Card, Text, Button, useTheme } from "react-native-paper";

export default function OverviewExploreCard() {
  const theme = useTheme();
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.cardTitle}>Explore more detailed sleep data</Text>
        <Text variant="bodyMedium" style={styles.cardContent}>
          View how your activities during the day affect your sleep.
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => router.push("/Explore")} buttonColor={theme.colors.primary} textColor={theme.colors.onPrimary}>Explore</Button>
      </Card.Actions>
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
    marginVertical: 10,
    marginHorizontal: 20,
  },
})