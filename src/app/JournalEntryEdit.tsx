import { StyleSheet, Pressable, TextInputEndEditingEventData, NativeSyntheticEvent } from "react-native";
import { Button, Dialog, Divider, Portal, Text, TextInput, useTheme } from "react-native-paper";
import ThemedView from "../components/ThemedView";
import { useState, useCallback } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { SingleChange } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { insertJournalRecord, journalRecordsMap } from "@/src/database/journal_records";
import { getId } from "@/src/database/auth";
import { constructRecord } from "@/src/types/Record";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { dateToString } from "@/src/utils/dates";
import LoadingScreen from "./LoadingScreen";
import TimePicker from "../components/datetimePickers/TimePicker";
import DatePicker from "../components/datetimePickers/DatePicker";
import SleepSection from "../components/listSections/journal/SleepSection";
import AlcoholSection from "../components/listSections/journal/AlcoholSection";
import CaffieneSection from "../components/listSections/journal/CaffieneSection";
import WakeSection from "../components/listSections/journal/WakeSection";
import { Modal } from "../types/Modal";
import { Consumable } from "../types/Consumable";

// keeps track of date/time picker modal changes
let selectedTimeModal: Modal = "alcohol";
let selectedTimeModalDate: Date | undefined = new Date();

/**
 * This screen allows the user to record when they woke up and went to sleep
 * as well as the quantity and time of alcoholic and caffienated drinks.
 * @returns JournalEntryEdit screen
 */
export default function JournalEntryEdit(): JSX.Element {
  const router = useRouter();
  const theme = useTheme();

  const [timeVisible, setTimeVisible] = useState<boolean>(false);         // shows the time picker modal
  const [dateVisible, setDateVisible] = useState<boolean>(false);         // shows the date picker modal
  const [alcoholQuantity, setAlcoholQuantity] = useState<string>("0");    // records number of alcoholic drinks consumed
  const [caffieneQuantity, setCaffieneQuantity] = useState<string>("0");  // records number of caffiene drinks consumed
  const [wakeDate, setWakeDate] = useState<Date | undefined>(undefined);
  const [sleepDate, setSleepDate] = useState<Date | undefined>(undefined);
  const [alcoholDate, setAlcoholDate] = useState<Date | undefined>(undefined);
  const [caffieneDate, setCaffieneDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dialogIsVisible, setDialogIsVisible] = useState<boolean>(false);
  const [dialogMsg, setDialogMsg] = useState<string>("");

  /**
   * @param type the type of consumed item e.g., "alcohol"
   * @returns TextInput that allows the user to specify number of consumed items
   */
  const renderQuantity = (type: Consumable): JSX.Element => {
    let valueFunc = alcoholQuantity;
    if (type === "caffiene") valueFunc = caffieneQuantity;

    return (
      <TextInput
        label="Quantity"
        value={valueFunc}
        maxLength={2}
        keyboardType="numeric"
        onChangeText={text => handleQuantityChange(text, type)}
        onEndEditing={e => handleQuantityEnd(e, type)}
      />
    )
  }

  /**
   * renders the date of a recorded question as a list description
   * @param date The date that the user recorded
   * @returns a string representing date, or "add" if date is undefined
   */
  const renderDescription = (date: Date | undefined): string => {
    return (date ? date.toString() : "Add");
  }

  /**
   * Updates quantity of this.state for the given type.
   * Called each time the text input is changed
   * @param text the text input from the user
   * @param type Consumable representing the type of item consumed
   */
  const handleQuantityChange = (text: string, type: Consumable): void => {
    let setQuantityFunc = setAlcoholQuantity;
    if (type === "caffiene") setQuantityFunc = setCaffieneQuantity;

    const num = Number(text);
    if (!text.includes(".") && (text === "" || !isNaN(num))) {
      setQuantityFunc(text);
    }
  }

  /**
   * Updates quantity of this.state for the given type.
   * Called when cancelling or submitting the text input (i.e., the last value).
   * @param e NativeSyntheticEvent<TextInputEndEditingEventData>
   * @param type Consumable representing the type of item consumed
   */
  const handleQuantityEnd = (e: NativeSyntheticEvent<TextInputEndEditingEventData>, type: Consumable): void => {
    let setQuantityFunc = setAlcoholQuantity;
    let setConsumableDate = setAlcoholDate;
    if (type === "caffiene") {
      setQuantityFunc = setCaffieneQuantity;
      setConsumableDate = setCaffieneDate;
    } 

    const num = Number(e.nativeEvent.text);
    if (isNaN(num)) {
      setQuantityFunc("0");
      setConsumableDate(undefined);
    } else if (num === 0) {
      setConsumableDate(undefined);
    } else {
      setQuantityFunc(String(num));
    }
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
      else if (selectedTimeModal === "wake") setWakeDate(selectedTimeModalDate);
      else if (selectedTimeModal === "sleep") setSleepDate(selectedTimeModalDate);
    },
    [setTimeVisible]
  );

  const validateUserInput = (): void => {
    if (!selectedTimeModalDate) {
      throw new Error("SelectedTimeModalDate is undefined");
    }
    if (wakeDate && selectedTimeModal !== "wake" && selectedTimeModalDate.getTime() < wakeDate.getTime()) {
      setDialogMsg("Your input cannot be recorded before you wake up");
      setDialogIsVisible(true);
      selectedTimeModalDate = undefined;
      return;
    }
    if (sleepDate && selectedTimeModal !== "sleep" && selectedTimeModalDate.getTime() > sleepDate.getTime()) {
      setDialogMsg("Your input cannot be recorded after you go to sleep");
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
    if (!wakeDate || !sleepDate) {
      setDialogMsg("Your entry must include when you woke up and went to sleep");
      setDialogIsVisible(true);
      return;
    }
    setIsLoading(true);
    const uuid = await getId();
    const record = constructRecord(uuid, wakeDate, sleepDate, alcoholQuantity, caffieneQuantity, alcoholDate, caffieneDate);
    await insertJournalRecord(record);
    journalRecordsMap.set(dateToString(wakeDate), record);
    router.back();
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <SafeAreaProvider>
      <ThemedView>

        <ThemedView style={styles.row}>
          {renderCancelButton()}
          <Text>Add Entry</Text>
          {renderSaveButton()}
        </ThemedView>
        <Divider />

        <WakeSection
          handleDateTimePress={handleDateTimePress}
          description={renderDescription(wakeDate)}
        />
        <Divider />

        <SleepSection 
          wakeDate={wakeDate} 
          handleDateTimePress={handleDateTimePress} 
          description={renderDescription(sleepDate)} 
        />
        <Divider />

        <AlcoholSection
          wakeDate={wakeDate}
          sleepDate={sleepDate}
          alcoholDate={alcoholDate}
          alcoholQuantity={alcoholQuantity}
          quantityInput={renderQuantity("alcohol")}
          handleDateTimePress={handleDateTimePress}
          description={renderDescription(alcoholDate)}
        />
        <Divider />

        <CaffieneSection
          wakeDate={wakeDate}
          sleepDate={sleepDate}
          caffieneDate={caffieneDate}
          caffieneQuantity={caffieneQuantity}
          quantityInput={renderQuantity("caffiene")}
          handleDateTimePress={handleDateTimePress}
          description={renderDescription(caffieneDate)}        />
        <Divider />

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
    </SafeAreaProvider>
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
    marginBottom: 10
  },
});
