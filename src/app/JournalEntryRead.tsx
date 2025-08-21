import { List, Button, Divider, TextInput } from "react-native-paper";
import ThemedView from "../components/ThemedView";
import { Record } from "../types/Record";
import { Consumable } from "../types/Consumable";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

type JournalEntryReadProps = {
    record: Record | undefined;
}

export default function JournalEntryRead(props: JournalEntryReadProps) {

    if (!props.record) {
        return <Button onPress={() => router.push({pathname: '/JournalEntryEdit'})} >add entry</Button>;
    }

    const wakeDate = props.record.content.wake_date;
    const sleepDate = props.record.content.sleep_date;
    const alcoholDate = props.record.content.alcohol_date;
    const caffieneDate = props.record.content.caffiene_date;
    const alcoholQuantity = props.record.content.alcohol_quantity;
    const caffieneQuantity = props.record.content.caffiene_quantity;

    /**
   * @param type the type of consumed item e.g., "alcohol"
   * @returns TextInput that allows the user to specify number of consumed items
   */
    const renderQuantity = (type: Consumable): JSX.Element => {
        let val = alcoholQuantity;
        if (type === "caffiene") val = caffieneQuantity;

        return (
            <TextInput
                disabled={true} // Read-only
                label="Quantity"
                value={val}
            />
        )
    }

    /**
     * renders the date of a recorded question as a list description
     * @param date The date that the user recorded
     * @returns a string representing date, or "" if date is undefined
     */
    const renderDescription = (date: Date | undefined): string => {
        return (date ? date.toString() : "");
    }

    return (
        <ThemedView>
            <List.Section style={styles.margin}>
                <List.Subheader>Wake up</List.Subheader>
                <List.Item
                    title="When did you wake up?"
                    description={renderDescription(new Date(wakeDate))}
                />
            </List.Section>
            <Divider />

            <List.Section style={styles.margin}>
                <List.Subheader>Sleep</List.Subheader>
                <List.Item
                    title="When did you go to sleep?"
                    description={renderDescription(new Date(sleepDate))}
                />
            </List.Section>
            <Divider />

            <List.Section style={styles.margin}>
                <List.Subheader>Alcohol</List.Subheader>
                <List.Item
                    title="Drinks containing alcohol"
                    right={() => renderQuantity("alcohol")}
                />
                <List.Item
                    title="When did you have your last drink"
                    description={renderDescription(alcoholDate ? new Date(alcoholDate) : undefined)}
                />
            </List.Section>
            <Divider />

            <List.Section style={styles.margin}>
                <List.Subheader>Caffiene</List.Subheader>
                <List.Item
                    title="Drinks containing caffiene"
                    right={() => renderQuantity("caffiene")}
                />
                <List.Item
                    title="When did you have your last drink"
                    description={renderDescription(caffieneDate ? new Date(caffieneDate) : undefined)}
                />
            </List.Section>
            <Button onPress={() => router.push({pathname: '/JournalEntryEdit'})} >edit entry</Button>

        </ThemedView>
    )
}

const styles = StyleSheet.create({
    margin: {
        marginVertical: 3,
    },
})