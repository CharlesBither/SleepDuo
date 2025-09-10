import {
  getRecordDetails,
  insertRecordDetails,
} from "@/src/database/recordDetails";
import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  Portal,
  Text,
  Button,
  useTheme,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import DatePicker from "../components/modals/datetimePickers/DatePicker";
import TimePicker from "../components/modals/datetimePickers/TimePicker";
import { Modal } from "@/src/types/Modal";
import { SingleChange } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { SleepRecord } from "../types/SleepRecord";
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
import AlcoholSection from "../components/listSections/RecordDetails/AlcoholSection";
import CaffieneSection from "../components/listSections/RecordDetails/CaffieneSection";
import DuringSleepSection from "../components/listSections/RecordDetails/DuringSleepSection";
import { constructSleepRecord } from "../utils/SleepRecord";
import { TimeOfDay } from "../types/TimeOfDay";
import { QualityOfSleep } from "../types/QualityOfSleep";

// keeps track of date/time picker modal changes
// let selectedTimeModal: Modal = "alcohol";
// let selectedTimeModalDate: Date | undefined = new Date();

let record: SleepRecord | undefined = undefined;

export default function RecordDetailsEdit() {
  const { guid } = useLocalSearchParams<{ guid: string }>();
  const details = getRecordDetails(guid);
  const theme = useTheme();

  const [alcoholTime, setAlcoholTime] = useState<TimeOfDay>("NA");
  const [caffieneTime, setCaffieneTime] = useState<TimeOfDay>("NA");
  const [alcoholQuantity, setAlcoholQuantity] = useState<string>(details ? details.alcohol_quantity : "0");
  const [caffieneQuantity, setCaffieneQuantity] = useState<string>(details ? details.caffiene_quantity : "0");
  const [hadNap, setHadNap] = useState<boolean>(details ? details.had_nap : false);
  const [qualityOfSleep, setQualityOfSleep] = useState<QualityOfSleep>(details ? details.quality_of_sleep : "5");

  const [loading, setLoading] = useState<boolean>(true);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [dialogIsVisible, setDialogIsVisible] = useState<boolean>(false);
  const [dialogMsg, setDialogMsg] = useState<string>("");
  const [timeVisible, setTimeVisible] = useState<boolean>(false); // shows the time picker modal
  const [dateVisible, setDateVisible] = useState<boolean>(false); // shows the date picker modal

  useEffect(() => {
    readRecord("SleepSession", guid).then((healthConnectRecord) => {
      record = constructSleepRecord(healthConnectRecord);
      setLoading(false);
    });
  }, []);

  // /** Called whenever the user wants to record a date */
  // const handleDateTimePress = (type: Modal): void => {
  //   selectedTimeModal = type;
  //   setDateVisible(true);
  // };

  // /** Called when the date modal is cancelled */
  // const onDismissDate = useCallback(() => {
  //   setDateVisible(false);
  // }, [dateVisible]);

  // /** Called when the date modal is confirmed */
  // const onConfirmDate: SingleChange = useCallback(
  //   (dateParams) => {
  //     setDateVisible(false);
  //     if (!dateParams.date)
  //       throw new Error("ReactNativePaperDates dateParams.date is undefined");
  //     selectedTimeModalDate = dateParams.date;
  //     setTimeVisible(true);
  //   },
  //   [dateVisible]
  // );

  // /** called when the time picker is dismissed */
  // const onDismissTime = useCallback(() => {
  //   setTimeVisible(false);
  // }, [setTimeVisible]);

  // /** called when the time picker is confirmed */
  // const onConfirmTime = useCallback(
  //   ({ hours, minutes }: { hours: number; minutes: number }) => {
  //     setTimeVisible(false);
  //     if (!selectedTimeModalDate) {
  //       throw new Error("selectedTimeModalDate is undefined");
  //     }
  //     selectedTimeModalDate.setHours(hours, minutes);

  //     // check for user input errors
  //     validateTimeInput();

  //     if (selectedTimeModal === "alcohol") {
  //       setAlcoholTime(selectedTimeModalDate);
  //     } else if (selectedTimeModal === "caffiene") {
  //       setCaffieneTime(selectedTimeModalDate);
  //     }
  //   },
  //   [setTimeVisible]
  // );

  // const validateTimeInput = (): void => {
  //   if (!selectedTimeModalDate) {
  //     throw new Error("SelectedTimeModalDate is undefined");
  //   }
  //   if (!record) {
  //     throw new Error("record is undefined");
  //   }
  //   if (selectedTimeModalDate.getTime() > record.startTime.getTime()) {
  //     setDialogMsg("Your input time must be before you went to sleep");
  //     setDialogIsVisible(true);
  //     selectedTimeModalDate = undefined;
  //   }
  // };

  const requiredFieldsAreValid = (): boolean => {
    return !(alcoholQuantity !== "0" && alcoholTime === "NA" || caffieneQuantity !== "0" && caffieneTime === "NA");
  }

  const renderCancelButton = (): JSX.Element => {
    return (
      <Pressable onPress={() => router.back()}>
        <FontAwesome6 name="x" size={24} color={theme.colors.onBackground} />
      </Pressable>
    );
  };

  const renderSaveButton = (): JSX.Element => {
    if (saveLoading) return <ActivityIndicator />
    return (
      <Pressable onPress={async () => await doSavePress()}>
        <FontAwesome name="save" size={24} color={theme.colors.onBackground} />
      </Pressable>
    );
  };

  /** Called when the user tries to save a journal record.
   * Inserts the record into the journal_records database table.
   */
  const doSavePress = async (): Promise<void> => {
    if (!requiredFieldsAreValid()) {
        console.log("invalid fields");
        setDialogMsg("You must input a time for your drinks if the quantity is non-zero.");
        setDialogIsVisible(true);
        return;
    }
    setSaveLoading(true);
    const uuid = await getId();
    const newDetails: RecordDetails = {
      created_at: new Date(),
      uuid: uuid,
      guid: guid,
      alcohol_quantity: alcoholQuantity,
      alcohol_time: alcoholTime,
      caffiene_quantity: caffieneQuantity,
      caffiene_time: caffieneTime,
      had_nap: hadNap,
      quality_of_sleep: qualityOfSleep,
    };

    await insertRecordDetails(newDetails);
    router.back();
  };

  if (loading) {
    return (
      <ThemedView>
        <LoadingScreen />
      </ThemedView>
    );
  } else if (!record) {
    throw new Error("record is undefined");
  }

  return (
    <ThemedView>
      <ThemedView style={styles.row}>
        {renderCancelButton()}
        <Text>Add Entry</Text>
        {renderSaveButton()}
      </ThemedView>
      <Divider />

{/* TODO: update section components and children */}
      <CaffieneSection
        caffieneQuantity={caffieneQuantity}
        caffieneDate={caffieneTime}
        setCaffieneQuantity={setCaffieneQuantity}
        setCaffieneDate={setCaffieneTime}
        // handleDateTimePress={handleDateTimePress}
      />
      <Divider />

      <AlcoholSection
        alcoholQuantity={alcoholQuantity}
        alcoholDate={alcoholTime}
        setAlcoholQuantity={setAlcoholQuantity}
        setAlcoholDate={setAlcoholTime}
        // handleDateTimePress={handleDateTimePress}
      />
      <Divider />

      <DuringSleepSection record={record} />
      <Divider />

      {/* <DatePicker
        dateVisible={dateVisible}
        onDismissDate={onDismissDate}
        onConfirmDate={onConfirmDate}
      />
      <TimePicker
        timeVisible={timeVisible}
        onConfirmTime={onConfirmTime}
        onDismissTime={onDismissTime}
      /> */}

      <Portal>
        <Dialog
          visible={dialogIsVisible}
          onDismiss={() => setDialogIsVisible(false)}
        >
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
  );
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
    marginTop: 60,
  },
});
