import { NativeSyntheticEvent, TextInputEndEditingEventData } from "react-native";
import { TextInput } from "react-native-paper";

type QuantityProps = {
    quantity: string;
    setQuantityFunc: (quantity: string) => void;
    setDateFunc: (date?: Date) => void;
}

export default function Quantity(props: QuantityProps) {

    const handleQuantityChange = (text: string): void => {
        const num = Number(text);
        if (!text.includes(".") && (text === "" || !isNaN(num))) {
            props.setQuantityFunc(text);
        }
    }

    const handleQuantityEnd = (e: NativeSyntheticEvent<TextInputEndEditingEventData>): void => {
        const num = Number(e.nativeEvent.text);
        if (isNaN(num)) {
            props.setQuantityFunc("0");
            props.setDateFunc(undefined);
        } else if (num === 0) {
            props.setDateFunc(undefined);
        } else {
            props.setQuantityFunc(String(num));
        }
    }

    return (
        <TextInput
            label="Quantity"
            value={props.quantity}
            maxLength={2}
            keyboardType="numeric"
            onChangeText={text => handleQuantityChange(text)}
            onEndEditing={e => handleQuantityEnd(e)}
        />
    )
}