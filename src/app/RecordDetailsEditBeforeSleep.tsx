import { getRecordDetails, insertRecordDetails } from "@/src/database/recordDetails";
import { useCallback, useState } from "react";
import { Dialog, List, Portal, Text, Button, useTheme, Divider } from "react-native-paper";
import Quantity from "../components/listSections/RecordDetails/Quantity";
import DatePicker from "../components/datetimePickers/DatePicker";
import TimePicker from "../components/datetimePickers/TimePicker";
import { Modal } from "@/src/types/Modal";
import { SingleChange } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { SleepRecord } from "@/src/records/SleepRecord";
import { router, useLocalSearchParams } from "expo-router";
import ThemedView from "../components/ThemedView";
import LoadingScreen from "./LoadingScreen";
import { Pressable } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { RecordDetails } from "../types/RecordDetails";
import { getId } from "../database/auth";
import { StyleSheet } from "react-native";
import { readRecord } from "react-native-health-connect";

export default function RecordDetailsEditBeforeSleep() {
    const { guid } = useLocalSearchParams<{ guid: string }>();

    const details = getRecordDetails(guid);
    let record: SleepRecord | undefined = undefined;
    const theme = useTheme();

    const [alcoholQuantity, setAlcoholQuantity] = useState("0");
    const [alcoholDate, setAlcoholDate] = useState<Date | undefined>(undefined);
    const [caffieneQuantity, setCaffieneQuantity] = useState("0");
    const [caffieneDate, setCaffieneDate] = useState<Date | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // const [record, setRecord] = useState<SleepRecord | undefined>(undefined);
    const [dialogIsVisible, setDialogIsVisible] = useState<boolean>(false);
    const [dialogMsg, setDialogMsg] = useState<string>("");
    const [timeVisible, setTimeVisible] = useState<boolean>(false);         // shows the time picker modal
    const [dateVisible, setDateVisible] = useState<boolean>(false);         // shows the date picker modal

    // keeps track of date/time picker modal changes
    let selectedTimeModal: Modal = "alcohol";
    let selectedTimeModalDate: Date | undefined = new Date();

    // const getSleepRecord = async (): Promise<void> => {
    //     const res = await readRecord("SleepSession", guid);
    //     console.log(res);
    //     setRecord(new SleepRecord(res));
    //     setIsLoading(false);
    // }
    // getSleepRecord;

    readRecord("SleepSession", guid)
        .then(healthConnectRecord => {
            // console.log(healthConnectRecord);
            record = new SleepRecord(healthConnectRecord);
            // console.log(record);
            setIsLoading(false);
        })

    if (details) {
        setAlcoholQuantity(details.alcohol_quantity);
        setAlcoholDate(details.alcohol_date);
        setCaffieneQuantity(details.caffiene_quantity);
        setCaffieneDate(details.caffiene_date);
    }

    /** Called whenever the user wants to record a date */
    const handleDateTimePress = (type: Modal): void => {
        selectedTimeModal = type;
        setDateVisible(true);
    }

    /** Called when the date modal is cancelled */
    const onDismissDate = useCallback(() => {
        setDateVisible(false);
    }, [dateVisible]);

    /** Called when the date modal is confirmed */
    const onConfirmDate: SingleChange = useCallback(
        (dateParams) => {
            setDateVisible(false);
            if (!dateParams.date) throw new Error("ReactNativePaperDates dateParams.date is undefined");
            selectedTimeModalDate = dateParams.date;
            console.log("selectedTimeModalDate = " + selectedTimeModalDate);
            setTimeVisible(true);
        },
        [dateVisible]
    );

    /** called when the time picker is dismissed */
    const onDismissTime = useCallback(() => {
        setTimeVisible(false);
    }, [setTimeVisible]);

    /** called when the time picker is confirmed */
    const onConfirmTime = useCallback(
        ({ hours, minutes }: { hours: number; minutes: number }) => {
            setTimeVisible(false);
            if (!selectedTimeModalDate) {
                throw new Error("selectedTimeModalDate is undefined");
            }
            selectedTimeModalDate.setHours(hours, minutes);

            // check for user input errors
            validateUserInput();

            if (selectedTimeModal === "alcohol") {
                setAlcoholDate(selectedTimeModalDate);
            }
            else if (selectedTimeModal === "caffiene") {
                setCaffieneDate(selectedTimeModalDate);
            }
        },
        [setTimeVisible]
    );

    const validateUserInput = (): void => {
        if (!selectedTimeModalDate) {
            throw new Error("SelectedTimeModalDate is undefined");
        }
        if (!record) {
            throw new Error("record is undefined");
        }
        if (selectedTimeModalDate.getTime() > record.startTime.getTime()) {
            console.log("modal: " + selectedTimeModalDate.getTime());
            console.log("record: " + record.startTime.getTime());
            setDialogMsg("Your input time must be before you went to sleep");
            setDialogIsVisible(true);
            selectedTimeModalDate = undefined;
        }
    }

    const renderCancelButton = (): JSX.Element => {
        return (
            <Pressable onPress={() => router.back()}>
                <FontAwesome6 name="x" size={24} color={theme.colors.onBackground} />
            </Pressable>
        )
    }

    const renderSaveButton = (): JSX.Element => {
        return (
            <Pressable onPress={async () => await doSavePress()}>
                <FontAwesome name="save" size={24} color={theme.colors.onBackground} />
            </Pressable>
        )
    }

    /** Called when the user tries to save a journal record.
     * Inserts the record into the journal_records database table.
     */
    const doSavePress = async (): Promise<void> => {
        setIsLoading(true);
        const uuid = await getId();
        const newDetails: RecordDetails = {
            created_at: new Date(),
            uuid: uuid,
            guid: guid,
            alcohol_quantity: alcoholQuantity,
            alcohol_date: alcoholDate,
            caffiene_quantity: caffieneQuantity,
            caffiene_date: caffieneDate
        }

        await insertRecordDetails(newDetails);
        router.back();
    }

    if (isLoading) {
        return (
            <ThemedView>
                <LoadingScreen />
            </ThemedView>
        )
    }

    return (
        <ThemedView>
            <ThemedView style={styles.row}>
                {renderCancelButton()}
                <Text>Add Entry</Text>
                {renderSaveButton()}
            </ThemedView>
            <Divider />

            <List.Section>
                <List.Subheader>Alcohol</List.Subheader>
                <List.Item
                    title="Drinks containing alcohol"
                    right={() => <Quantity quantity={alcoholQuantity} setQuantityFunc={setAlcoholQuantity} setDateFunc={setAlcoholDate} />}
                />
                <List.Item
                    title="When did you have your last drink"
                    onPress={() => handleDateTimePress("alcohol")}
                    description={alcoholDate ? alcoholDate.toString() : "Add"}
                />
            </List.Section>

            <DatePicker dateVisible={dateVisible} onDismissDate={onDismissDate} onConfirmDate={onConfirmDate} />
            <TimePicker timeVisible={timeVisible} onConfirmTime={onConfirmTime} onDismissTime={onDismissTime} />

            <Portal>
                <Dialog visible={dialogIsVisible} onDismiss={() => setDialogIsVisible(false)}>
                    <Dialog.Title>Input Error</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">{dialogMsg}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDialogIsVisible(false)}>Okay</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    text: {
        marginLeft: 15,
        marginBottom: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 15,
        marginBottom: 10,
        marginTop: 60
    },
});
