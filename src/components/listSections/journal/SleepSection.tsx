import { Modal } from "@/src/app/JournalEntryEdit";
import { List, useTheme } from "react-native-paper"

type SleepSectionProps = {
    wakeDate?: Date;
    handleDateTimePress: (type: Modal) => void;
    description: string;
}

export default function SleepSection(props: SleepSectionProps) {
    const theme = useTheme();

    if (props.wakeDate) {
        return (
        <List.Section>
            <List.Subheader>Sleep</List.Subheader>
            <List.Item
            title="When did you go to sleep?"
            onPress={() => props.handleDateTimePress("sleep")}
            description={props.description}
            />
        </List.Section>
        )
    }
    return (
        <List.Section style={{ backgroundColor: theme.colors.surfaceDisabled }}>
        <List.Subheader>Sleep</List.Subheader>
        <List.Item
            title="When did you go to sleep?"
            description={props.description}
        />
        </List.Section>
    )
}