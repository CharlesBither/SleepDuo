import { List } from "react-native-paper"
import ThemedView from "./ThemedView"

export default function AddActivity() {

    return (
        <ThemedView>
            <List.Section>
                <List.Subheader>Some title</List.Subheader>
                <List.Item title="First Item" left={() => <List.Icon icon="folder" />} />
                <List.Item
                    title="Second Item"
                    // left={() => <List.Icon color={MD3Colors.tertiary70} icon="folder" />}
                />
            </List.Section>
        </ThemedView>
    )
}