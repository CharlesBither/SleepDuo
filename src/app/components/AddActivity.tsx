import { StyleSheet } from "react-native"
import { List, Divider, Text } from "react-native-paper"
import ThemedView from "./ThemedView"

export default function AddActivity() {

    return (
        <ThemedView>
            <Text variant="displaySmall" style={styles.text}>Add activity</Text>
            <List.Section>
                <Divider />
                <List.Item title="Activity Type"
                    right={() => <Text variant="bodyLarge" theme={{ colors: { onSurface: 'gray' } }}>Add</Text>}
                />
                <Divider />
                <List.Item title="Start" 
                    right={() => <Text variant="bodyLarge" theme={{ colors: { onSurface: 'gray' } }}>Add</Text>}
                />
                <List.Item title="Duration" 
                    right={() => <Text variant="bodyLarge">30 min</Text>}
                />
            </List.Section>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    text: {
        marginLeft: 15,
    }
})