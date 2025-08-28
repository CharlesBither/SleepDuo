import { StyleSheet, View } from "react-native";
import { SegmentedButtons } from "react-native-paper";

type OverviewIntervalSegmentedButtonProps = {
    interval: string;
    setInterval: React.Dispatch<React.SetStateAction<string>>;
}

export default function OverviewIntervalSegmentedButton(props: OverviewIntervalSegmentedButtonProps) {

    return (
        <View style={styles.container}>
            <SegmentedButtons
                value={props.interval}
                onValueChange={props.setInterval}
                buttons={[
                    {
                        value: '7',
                        label: 'Last 7 days',
                    },
                    {
                        value: '30',
                        label: 'Last 30 days',
                    },
                    { value: 'All time', label: 'All time' },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 15,
        alignItems: 'center',
    },
});