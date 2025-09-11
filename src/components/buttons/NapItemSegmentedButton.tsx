import { HadNapValue } from "@/src/types/HadNapValue";
import { StyleSheet, View } from "react-native";
import { SegmentedButtons } from "react-native-paper";

type NapItemSegmentedButtonProps = {
    value: HadNapValue;
    setValue: React.Dispatch<React.SetStateAction<HadNapValue>>;
}

export default function NapItemSegmentedButton(props: NapItemSegmentedButtonProps) {

    return (
        <View style={styles.container}>
            <SegmentedButtons
                value={props.value}
                onValueChange={props.setValue}
                buttons={[
                    {
                        value: 'yes',
                        label: 'Yes',
                    },
                    {
                        value: 'no',
                        label: 'No',
                    }
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