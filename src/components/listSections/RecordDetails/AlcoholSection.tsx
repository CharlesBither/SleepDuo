import { List, useTheme } from "react-native-paper";
import Quantity from "../../textInputs/Quantity";
import { Consumable } from "@/src/types/Consumable";
import { dateTimeFormat } from "@/src/utils/dates";

type AlcoholSectionProps = {
    alcoholQuantity: string;
    alcoholDate?: Date;
    setAlcoholQuantity: (quantity: string) => void;
    setAlcoholDate: (date?: Date) => void;
    handleDateTimePress: (type: Consumable) => void;
}

export default function AlcoholSection(props: AlcoholSectionProps) {
    const theme = useTheme();
    if (props.alcoholQuantity === "0") {
        return (
            <List.Section>
                <List.Subheader>Alcohol</List.Subheader>
                <List.Item
                    title="Drinks containing alcohol"
                    right={() => <Quantity quantity={props.alcoholQuantity} setQuantityFunc={props.setAlcoholQuantity} setDateFunc={props.setAlcoholDate} />}
                />
                <List.Item
                    title="When did you have your last drink"
                    description={props.alcoholDate ? dateTimeFormat.format(props.alcoholDate) : "N/A"}
                    style={{ backgroundColor: theme.colors.surfaceDisabled }}
                />
            </List.Section>
        )
    }
    return (
        <List.Section>
            <List.Subheader>Alcohol</List.Subheader>
            <List.Item
                title="Drinks containing alcohol"
                right={() => <Quantity quantity={props.alcoholQuantity} setQuantityFunc={props.setAlcoholQuantity} setDateFunc={props.setAlcoholDate} />}
            />
            <List.Item
                title="When did you have your last drink"
                onPress={() => props.handleDateTimePress("alcohol")}
                description={props.alcoholDate ? dateTimeFormat.format(props.alcoholDate) : "Add"}
            />
        </List.Section>
    )
}