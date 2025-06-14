import { StyleSheet, Pressable, View, TextInputEndEditingEventData, NativeSyntheticEvent } from "react-native";
import { List, Divider, Text, TextInput } from "react-native-paper";
import ThemedView from "../ThemedView";
import { useState, useCallback } from "react";
import { TimePickerModal } from "react-native-paper-dates";
import DisplayTimeBody from "../time-picker/DisplayTimeBody";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

type Consumable = "alcohol" | "caffiene"

export default function JournalEntryEdit(): JSX.Element {
  // date param passed in from the journal screen
  const params = useLocalSearchParams();
  if (typeof params.date !== "string") {
    throw new Error("missing or invalid date param");
  }
  const dateParam = new Date(params.date);

  const router = useRouter();
  const [selectedTimeModal, setSelectedTimeModal] = useState<
    "alcohol" | "caffiene"
  >("alcohol");
  const [visible, setVisible] = useState<boolean>(false); // shows the time picker modal
  const [alcoholMinutes, setAlcoholMinutes] = useState<number>(-1); // records minutes from 00:00 since last drink
  const [caffieneMinutes, setCaffieneMinutes] = useState<number>(-1); // records minutes from 00:00 since last drink
  const [alcoholQuantity, setAlcoholQuantity] = useState<string>("0"); // records number of alcoholic drink consumed
  const [caffieneQuantity, setCaffieneQuantity] = useState<string>("0"); // records number of caffiene drink consumed
  const [date, setDate] = useState<Date>(dateParam); // the date of this journal entry at 00:00

  /** called when any time picker is dismissed */
  const onDismiss = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  /**
   * Called when a time is confirmed for last alcohol drink.
   * Sets alcoholMinutes to the time of last alcohol drink
   * in minutes since 00:00.
   */
  const onAlcoholConfirm = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setVisible(false);
      const totalMinutes = hours * 60 + minutes;
      setAlcoholMinutes(totalMinutes);
    },
    [setVisible]
  );

  /**
   * Called when a time is confirmed for last caffiene drink.
   * Sets alcoholMinutes to the time of last caffiene drink
   * in minutes since 00:00.
   */
  const onCaffieneConfirm = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setVisible(false);
      const totalMinutes = hours * 60 + minutes;
      setCaffieneMinutes(totalMinutes);
    },
    [setVisible]
  );

  /** renders a time picker */
  const renderTimePicker = (): JSX.Element => {
    const onConfirmFunc =
      selectedTimeModal === "alcohol" ? onAlcoholConfirm : onCaffieneConfirm;
    return (
      <View style={{ justifyContent: "center", flex: 1, alignItems: "center" }}>
        <TimePickerModal
          visible={visible}
          onDismiss={onDismiss}
          onConfirm={onConfirmFunc}
          animationType="slide"
        />
      </View>
    );
  };

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
  const handleTimePress = (type: Consumable): void => {
    setSelectedTimeModal(type);
    setVisible(true);
  };

  return (
    <SafeAreaProvider>
      <ThemedView>
        <Text variant="displaySmall" style={styles.text}>
          Add Journal Entry
        </Text>
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
