import { Modal } from "@/src/app/JournalEntryEdit";
import { Pressable } from "react-native";
import { List, useTheme } from "react-native-paper"

type AlcoholSectionProps = {
    wakeDate?: Date;
    sleepDate?: Date;
    caffieneDate?: Date;
    caffieneQuantity: string;
    quantityInput: JSX.Element; 
    handleDateTimePress: (type: Modal) => void;
    description: string;
}

export default function CaffieneSection(props: AlcoholSectionProps) {
    const theme = useTheme();

    if (props.wakeDate && props.sleepDate && props.caffieneQuantity != '0') {
        return (
        <List.Section>
            <List.Subheader>Caffiene</List.Subheader>
            <Pressable>
            <List.Item
                title="Drinks containing caffiene"
                right={() => props.quantityInput}
            />
            </Pressable>
            <List.Item
            title="When did you have your last drink"
            onPress={() => props.handleDateTimePress("caffiene")}
            description={props.description}
            />
        </List.Section>
        )
    } else if (props.wakeDate && props.sleepDate) {
        return (
        <List.Section>
            <List.Subheader>Caffiene</List.Subheader>
            <Pressable>
            <List.Item
                title="Drinks containing caffiene"
                right={() => props.quantityInput}
            />
            </Pressable>
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
            <List.Subheader>Caffiene</List.Subheader>
            <Pressable>
            <List.Item
                title="Drinks containing caffiene"
                right={() => props.quantityInput}
            />
            </Pressable>
            <List.Item
            title="When did you have your last drink"
            description={props.description}
            />
        </List.Section>
    )
}