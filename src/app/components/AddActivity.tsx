import { List, useTheme } from "react-native-paper"

export default function AddActivity() {

    const theme = useTheme()


    return (
        <>
            <List.Section>
                <List.Subheader>Some title</List.Subheader>
                <List.Item title="First Item" left={() => <List.Icon icon="folder" />} />
                <List.Item
                    title="Second Item"
                    // left={() => <List.Icon color={MD3Colors.tertiary70} icon="folder" />}
                />
            </List.Section>
        </>
    )
}