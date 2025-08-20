import { Modal } from "@/src/app/JournalEntryEdit";
import { List, useTheme } from "react-native-paper"

type AlcoholSectionProps = {
    wakeDate?: Date;
    sleepDate?: Date;
    alcoholDate?: Date;
    alcoholQuantity: string;
    quantityInput: JSX.Element; 
    handleDateTimePress: (type: Modal) => void;
    description: string;
}

export default function AlcoholSection(props: AlcoholSectionProps) {
    const theme = useTheme();

    if (props.wakeDate && props.sleepDate && props.alcoholQuantity != '0') {
        return (
        <List.Section>
            <List.Subheader>Alcohol</List.Subheader>
            <List.Item
            title="Drinks containing alcohol"
            right={() => props.quantityInput}
            />
            <List.Item
            title="When did you have your last drink"
            onPress={() => props.handleDateTimePress("alcohol")}
            description={props.description}
            />
        </List.Section>
        )
    } else if (props.wakeDate && props.sleepDate) {
        return (
        <List.Section>
            <List.Subheader>Alcohol</List.Subheader>
            <List.Item
            title="Drinks containing alcohol"
            right={() => props.quantityInput}
            />
            <List.Item
            title="When did you have your last drink"
            description={props.description}
            style={{ backgroundColor: theme.colors.surfaceDisabled }}
            />
        </List.Section>
        )
    }
    return (
        <List.Section style={{ backgroundColor: theme.colors.surfaceDisabled }}>
            <List.Subheader>Alcohol</List.Subheader>
            <List.Item
            title="Drinks containing alcohol"
            right={() => props.quantityInput}
            />
            <List.Item
            title="When did you have your last drink"
            description={props.description}
            />
        </List.Section>
    )
}