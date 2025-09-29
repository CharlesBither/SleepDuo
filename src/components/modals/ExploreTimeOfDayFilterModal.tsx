import { TimeOfDay } from "@/src/types/TimeOfDay";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Modal, Portal, Button, useTheme, ActivityIndicator, Checkbox } from "react-native-paper";

type ExploreTimeOfDayFilterModalProps = {
    filter: TimeOfDay[];
    visible: boolean;
    onFilterChange: (filter: TimeOfDay[]) => Promise<void>;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ExploreTimeOfDayFilterModal(props: ExploreTimeOfDayFilterModalProps) {
    const theme = useTheme();
    const [saveLoading, setSaveLoading] = useState(false);
    const [filterSelection, setFilterSelection] = useState(props.filter);

    const handleSavePress = async (): Promise<void> => {
        setSaveLoading(true);
        await props.onFilterChange(filterSelection);
        setSaveLoading(false);
        props.setVisible(false);
    }

    const handleCancelPress = (): void => {
        setFilterSelection(props.filter);
        props.setVisible(false);
    }

    const handleCheckboxPress = (filter: TimeOfDay): void => {
        const currSelection = new Set(filterSelection);
        if (currSelection.has(filter)) {
            currSelection.delete(filter);
        } else {
            currSelection.add(filter);
        }
        setFilterSelection([...currSelection]);
    }

    return (
        <Portal>
            <Modal
                visible={props.visible}
                onDismiss={() => props.setVisible(false)}
                contentContainerStyle={{ ...styles.container, backgroundColor: theme.colors.elevation.level2 }}
            >

                <Checkbox.Item label="AM" status={filterSelection.includes("AM") ? "checked" : "unchecked"} onPress={() => handleCheckboxPress("AM")} />
                <Checkbox.Item label="PM" status={filterSelection.includes("PM") ? "checked" : "unchecked"} onPress={() => handleCheckboxPress("PM")} />
                <Checkbox.Item label="LN" status={filterSelection.includes("LN") ? "checked" : "unchecked"} onPress={() => handleCheckboxPress("LN")} />
                <Checkbox.Item label="NA" status={filterSelection.includes("NA") ? "checked" : "unchecked"} onPress={() => handleCheckboxPress("NA")} />

                <View style={styles.buttonContainer}>
                    <View style={{ flex: 1 }}></View>
                    <Button onPress={handleCancelPress} mode="outlined" style={styles.button}>Cancel</Button>
                    <Button onPress={handleSavePress} mode="contained" style={styles.button}>{saveLoading ? <ActivityIndicator color={theme.colors.inversePrimary} /> : "Save"}</Button>
                </View>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        marginHorizontal: 20,
        borderRadius: 20,
    },
    buttonContainer: {
        flexDirection: "row",
    },
    button: {
        marginRight: 10,
        marginTop: 20,
    }
});
