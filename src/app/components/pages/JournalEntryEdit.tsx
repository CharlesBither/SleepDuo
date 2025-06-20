import { StyleSheet, Pressable, View, TextInputEndEditingEventData, NativeSyntheticEvent } from "react-native";
import { List, Divider, Text, TextInput } from "react-native-paper";
import ThemedView from "../ThemedView";
import { useState, useCallback } from "react";
import { TimePickerModal, DatePickerModal } from "react-native-paper-dates";
import DisplayTimeBody from "../time-picker/DisplayTimeBody";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import FunctionButton from "../Button/FunctionButton";

// types of recorded substances consumed
type Consumable = "alcohol" | "caffiene"
type Modal = Consumable | "wake" | "sleep"

export default function JournalEntryEdit(): JSX.Element {
  // date param passed in from the journal screen
  const params = useLocalSearchParams();
  if (typeof params.date !== "string") {
    throw new Error("missing or invalid date param");
  }
  const dateParam = new Date(params.date);

  const router = useRouter();
  const [selectedTimeModal, setSelectedTimeModal] = useState<Modal>("alcohol");
  const [timeVisible, setTimeVisible] = useState<boolean>(false);         // shows the time picker modal
  const [dateVisible, setDateVisible] = useState<boolean>(false);         // shows the date picker modal
  const [wakeMinutes, setWakeMinutes] = useState<number>(-1);             // records minutes from 00:00 since wake up
  const [sleepMinutes, setSleepMinutes] = useState<number>(-1);           // records minutes from 00:00 since sleep
  const [alcoholMinutes, setAlcoholMinutes] = useState<number>(-1);       // records minutes from 00:00 since last drink
  const [caffieneMinutes, setCaffieneMinutes] = useState<number>(-1);     // records minutes from 00:00 since last drink
  const [alcoholQuantity, setAlcoholQuantity] = useState<string>("0");    // records number of alcoholic drink consumed
  const [caffieneQuantity, setCaffieneQuantity] = useState<string>("0");  // records number of caffiene drink consumed
  const [date, setDate] = useState<Date>(dateParam);                      // the date of this journal entry at 00:00

  /** called when any time picker is dismissed */
  const onDismiss = useCallback(() => {
    setTimeVisible(false);
  }, [setTimeVisible]);

  /**
   * Called when a time is confirmed for last alcohol drink.
   * Sets alcoholMinutes to the time of last alcohol drink
   * in minutes since 00:00.
   */
  const onAlcoholConfirm = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setTimeVisible(false);
      const totalMinutes = hours * 60 + minutes;
      setAlcoholMinutes(totalMinutes);
    },
    [setTimeVisible]
  );

  /**
   * Called when a time is confirmed for last caffiene drink.
   * Sets alcoholMinutes to the time of last caffiene drink
   * in minutes since 00:00.
   */
  const onCaffieneConfirm = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setTimeVisible(false);
      const totalMinutes = hours * 60 + minutes;
      setCaffieneMinutes(totalMinutes);
    },
    [setTimeVisible]
  );

  const onWakeConfirm = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setTimeVisible(false);
      const totalMinutes = hours * 60 + minutes;
      setWakeMinutes(totalMinutes);
    },
    [setTimeVisible]
  );

  const onSleepConfirm = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setTimeVisible(false);
      const totalMinutes = hours * 60 + minutes;
      setSleepMinutes(totalMinutes);
    },
    [setTimeVisible]
  );

  /** renders a time picker */
  const renderTimePicker = (): JSX.Element => {
    let onConfirmFunc = onAlcoholConfirm;
    if (selectedTimeModal === "caffiene") onConfirmFunc = onCaffieneConfirm;
    else if (selectedTimeModal === "wake") onConfirmFunc = onWakeConfirm;
    else if (selectedTimeModal === "sleep") onConfirmFunc = onSleepConfirm;
    return (
      <View style={{ justifyContent: "center", flex: 1, alignItems: "center" }}>
        <TimePickerModal
          visible={timeVisible}
          onDismiss={onDismiss}
          onConfirm={onConfirmFunc}
          animationType="slide"
        />
      </View>
    );
  };

  // /** renders a date picker */
  // const renderDatePicker = (): JSX.Element => {
  //   return (
  //     <DatePickerModal
  //         locale="en"
  //         mode="single"
  //         visible={dateVisible}
  //         onDismiss={onDismissDate}
  //         date={date}
  //         onConfirm={onConfirmWakeDate}
  //       />
  //   )
  // }

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
    if (type === "caffiene") setQuantityFunc = setCaffieneQuantity;

    const num = Number(e.nativeEvent.text);
    if (isNaN(num)) {
      setQuantityFunc("0");
    } else {
      setQuantityFunc(String(num));
    }
  }

  /**
   * Called when the user clicks the quantity selection.
   * Sets selectedTimeModal to the given type.
   * @param type the Consumable that was consumed
   */
  const handleTimePress = (type: Modal): void => {
    setSelectedTimeModal(type);
    setTimeVisible(true);
  };

  // const onDismissDate = useCallback(() => {
  //   setDateVisible(false);
  // }, [dateVisible]);

  // const onConfirmWakeDate = useCallback(
  //   (dateParams) => {
  //     setDateVisible(false);
  //     (dateParams.date);
  //   },
  //   [dateVisible, wakeMinutes]
  // );

  return (
    <SafeAreaProvider>
      <ThemedView>
        <Text variant="displaySmall" style={styles.text}>
          Add Journal Entry
        </Text>
        <Divider />

        <List.Section>
          <List.Subheader>Wake up</List.Subheader>
          <List.Item
            title="When did you wake up?"
            right={() => (
              <Pressable onPress={() => handleTimePress("wake")}>
                <DisplayTimeBody time={wakeMinutes} />
              </Pressable>
            )}
          />
        </List.Section>
        <Divider />

        <List.Section>
          <List.Subheader>Alcohol</List.Subheader>
          <List.Item
            title="Drinks containing alcohol"
            right={() => renderQuantity("alcohol")}
          />
          <List.Item
            title="When did you have your last drink"
            right={() => (
              <Pressable onPress={() => handleTimePress("alcohol")}>
                <DisplayTimeBody time={alcoholMinutes} />
              </Pressable>
            )}
          />
        </List.Section>
        <Divider />

        <List.Section>
          <List.Subheader>Caffiene</List.Subheader>
          <Pressable>
            <List.Item
              title="Drinks containing caffiene"
              right={() => renderQuantity("caffiene")}
            />
          </Pressable>
          <List.Item
            title="When did you have your last drink"
            right={() => (
              <Pressable onPress={() => handleTimePress("caffiene")}>
                <DisplayTimeBody time={caffieneMinutes} />
              </Pressable>
            )}
          />
        </List.Section>
        <Divider />

        <List.Section>
          <List.Subheader>Sleep</List.Subheader>
          <List.Item
            title="When did you go to sleep?"
            right={() => (
              <Pressable onPress={() => handleTimePress("sleep")}>
                <DisplayTimeBody time={sleepMinutes} />
              </Pressable>
            )}
          />
        </List.Section>
        <Divider />

        <FunctionButton label="date" func={() => console.log(date.toString())} />

        {/* {renderDatePicker()} */}
        {renderTimePicker()}
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
  },
});
