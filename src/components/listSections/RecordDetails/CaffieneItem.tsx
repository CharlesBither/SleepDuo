import { List } from "react-native-paper";
import Quantity from "../../textInputs/Quantity";
import TimeOfDaySegmentedButton from "../../buttons/TimeOfDaySegmentedButton";
import { TimeOfDay } from "@/src/types/TimeOfDay";

type CaffieneItemProps = {
    caffieneQuantity: string;
    setCaffieneQuantity: (quantity: string) => void;
    caffieneTime: TimeOfDay;
    setCaffieneTime: React.Dispatch<React.SetStateAction<TimeOfDay>>;
}

export default function CaffieneItem(props: CaffieneItemProps) {
    if (props.caffieneQuantity === "0" || props.caffieneQuantity === "" || props.caffieneQuantity === "00") {
        return (
            <>
                <List.Item
                    title="Drinks containing caffiene"
                    right={() => <Quantity quantity={props.caffieneQuantity} setQuantityFunc={props.setCaffieneQuantity} setTime={props.setCaffieneTime} />}
                />
                <List.Item
                    title="When did I have my last drink"
                    description={() => <TimeOfDaySegmentedButton timeOfDay={props.caffieneTime} setTimeOfDay={props.setCaffieneTime} disabled={true} />}
                />
            </>
        )
    }
    return (
        <>
            <List.Item
                title="Drinks containing caffiene"
                right={() => <Quantity quantity={props.caffieneQuantity} setQuantityFunc={props.setCaffieneQuantity} setTime={props.setCaffieneTime}  />}
            />
            <List.Item
                title="When did I have my last drink"
                description={() => <TimeOfDaySegmentedButton timeOfDay={props.caffieneTime} setTimeOfDay={props.setCaffieneTime} disabled={false} />}
            />
        </>
    )
}