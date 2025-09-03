import { List, useTheme } from "react-native-paper";
import Quantity from "../../textInputs/Quantity";
import { Consumable } from "@/src/types/Consumable";
import { getFormattedDateTime } from "@/src/utils/dates";

type CaffieneSectionProps = {
    caffieneQuantity: string;
    caffieneDate?: Date;
    setCaffieneQuantity: (quantity: string) => void;
    setCaffieneDate: (date?: Date) => void;
    handleDateTimePress: (type: Consumable) => void;
}

export default function CaffieneSection(props: CaffieneSectionProps) {
    const theme = useTheme();
    if (props.caffieneQuantity === "0" || props.caffieneQuantity === "") {
        return (
            <List.Section>
                <List.Subheader>Caffiene</List.Subheader>
                <List.Item
                    title="Drinks containing caffiene"
                    right={() => <Quantity quantity={props.caffieneQuantity} setQuantityFunc={props.setCaffieneQuantity} setDateFunc={props.setCaffieneDate} />}
                />
                <List.Item
                    title="When did you have your last drink"
                    description="N/A"
                    style={{ backgroundColor: theme.colors.surfaceDisabled }}
                />
            </List.Section>
        )
    }
    return (
        <List.Section>
            <List.Subheader>Caffiene</List.Subheader>
            <List.Item
                title="Drinks containing caffiene"
                right={() => <Quantity quantity={props.caffieneQuantity} setQuantityFunc={props.setCaffieneQuantity} setDateFunc={props.setCaffieneDate} />}
            />
            <List.Item
                title="When did you have your last drink"
                onPress={() => props.handleDateTimePress("caffiene")}
                description={props.caffieneDate ? getFormattedDateTime(props.caffieneDate) : "Add"}
            />
        </List.Section>
    )
}