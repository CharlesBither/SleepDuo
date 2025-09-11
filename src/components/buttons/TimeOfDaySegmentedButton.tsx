import { TimeOfDay } from "@/src/types/TimeOfDay";
import { StyleSheet, View } from "react-native";
import { SegmentedButtons } from "react-native-paper";

type OverviewIntervalSegmentedButtonProps = {
    timeOfDay: TimeOfDay;
    setTimeOfDay: React.Dispatch<React.SetStateAction<TimeOfDay>>;
    disabled: boolean;
}

export default function TimeOfDaySegmentedButton(props: OverviewIntervalSegmentedButtonProps) {

    const handleButtonChange = (value: TimeOfDay): void => {
        if (!props.disabled) {
            props.setTimeOfDay(value);
        }
    }

    return (
        <View style={styles.container}>
            <SegmentedButtons
                value={props.timeOfDay}
                onValueChange={(value) => handleButtonChange(value)}
                buttons={[
                    {
                        value: 'AM',
                        label: 'AM',
                        disabled: props.disabled ? true : false,
                    },
                    {
                        value: 'PM',
                        label: 'PM',
                        disabled: props.disabled ? true : false,
                    },
                    { 
                        value: 'LN', 
                        label: 'Late Night',
                        disabled: props.disabled ? true : false,
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginHorizontal: 15,
        alignItems: 'center',
    },
});