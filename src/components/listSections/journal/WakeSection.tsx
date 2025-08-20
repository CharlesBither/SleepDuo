import { Modal } from "@/src/app/JournalEntryEdit";
import { List } from "react-native-paper";

type WakeSectionProps = {
    handleDateTimePress: (type: Modal) => void;
    description: string;
}

export default function WakeSection(props: WakeSectionProps) {
    return (
        <List.Section>
            <List.Subheader>Wake up</List.Subheader>
            <List.Item
            title="When did you wake up?"
            onPress={() => props.handleDateTimePress("wake")}
            description={props.description}
            />
        </List.Section>
    )
}