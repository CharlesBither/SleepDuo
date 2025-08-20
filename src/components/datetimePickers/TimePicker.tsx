import { View } from "react-native";
import { TimePickerModal } from "react-native-paper-dates";

type TimePickerProps = {
    timeVisible: boolean;
    onDismissTime: () => void;
    onConfirmTime: ({ hours, minutes }: { hours: number; minutes: number }) => void;
}

export default function TimePicker(props: TimePickerProps) {
    return (
        <View style={{ justifyContent: "center", flex: 1, alignItems: "center" }}>
        <TimePickerModal
            visible={props.timeVisible}
            onDismiss={props.onDismissTime}
            onConfirm={props.onConfirmTime}
            animationType="slide"
        />
        </View>
    );
}