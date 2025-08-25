import { NativeSyntheticEvent, TextInputEndEditingEventData } from "react-native";
import { TextInput } from "react-native-paper";

type QuantityProps = {
    quantity: string;
    setQuantityFunc: (quantity: string) => void;
    setDateFunc: (date?: Date) => void;
}

export default function Quantity(props: QuantityProps) {

    /**
   * Updates quantity of this.state for the given type.
   * Called each time the text input is changed
   * @param text the text input from the user
   */
    const handleQuantityChange = (text: string): void => {
        const num = Number(text);
        if (!text.includes(".") && (text === "" || !isNaN(num))) {
            props.setQuantityFunc(text);
        }
    }

    /**
   * Updates quantity of this.state for the given type.
   * Called when cancelling or submitting the text input (i.e., the last value).
   * @param e event such that e.nativeEvent.text is the user input string
   */
    const handleQuantityEnd = (e: NativeSyntheticEvent<TextInputEndEditingEventData>): void => {
        const text = e.nativeEvent.text
        const num = Number(text);
        if (text === "" || isNaN(num)) {
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