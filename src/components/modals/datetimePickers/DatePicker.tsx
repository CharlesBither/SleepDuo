import { DatePickerModal } from "react-native-paper-dates";
import { SingleChange } from "react-native-paper-dates/lib/typescript/Date/Calendar";

type DatePickerProps = {
    dateVisible: boolean;
    onDismissDate: () => void;
    onConfirmDate: SingleChange;
}

export default function DatePicker(props: DatePickerProps) {
    return (
      <DatePickerModal
          locale="en"
          mode="single"
          visible={props.dateVisible}
          onDismiss={props.onDismissDate}
          date={new Date()}
          onConfirm={props.onConfirmDate}
        />
    )
}