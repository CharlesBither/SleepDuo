import { Card, Text, useTheme } from "react-native-paper";
import ThemedView from "../views/ThemedView";
import { ScrollView, StyleSheet } from "react-native";
import { getErrorMsg } from "../stores/error";

export default function ErrorScreen() {
    const theme = useTheme();
    return (
        <ThemedView>
            <ScrollView>
                <Text variant="titleLarge" style={styles.title}>An unexpected error occurred:</Text>
                <Card style={{...styles.card, backgroundColor: theme.colors.elevation.level1}}>
                    <Card.Content>
                        <Text>{getErrorMsg()}</Text>
                    </Card.Content>
                </Card>
            </ScrollView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    title: {
        marginTop: 50,
        marginLeft: 20,
        marginBottom: 10,
    },
    card: {
        marginHorizontal: 10,
    },
})