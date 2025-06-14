import { StyleSheet, Pressable, View } from "react-native";
import { List, Divider, Text } from "react-native-paper";
import ThemedView from "../ThemedView";
import { useState, useCallback } from "react";
import { TimePickerModal } from "react-native-paper-dates";
import DisplayTimeBody from "../time-picker/DisplayTimeBody";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function JournalEntryEdit(): JSX.Element {

  // date param passed in from the journal screen
  const params = useLocalSearchParams();
  if (typeof(params.date) !== "string") {
    throw new Error("missing or invalid date param");
  }
  const dateParam = new Date(params.date);

  const router = useRouter();
  const [selectedTimeModal, setSelectedTimeModal] = useState<"alcohol" | "caffiene">("alcohol");
  const [visible, setVisible] = useState<boolean>(false);            // shows the time picker modal
  const [alcoholMinutes, setAlcoholMinutes] = useState<number>(-1);   // records minutes from 00:00 since last drink
  const [caffieneMinutes, setCaffieneMinutes] = useState<number>(-1); // records minutes from 00:00 since last drink
  const [date, setDate] = useState<Date>(dateParam);                 // the date of this journal entry at 00:00

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
    const onConfirmFunc = (selectedTimeModal === "alcohol" ? onAlcoholConfirm : onCaffieneConfirm);
    return (
        <View
          style={{ justifyContent: "center", flex: 1, alignItems: "center" }}
        >
          <TimePickerModal
            visible={visible}
            onDismiss={onDismiss}
            onConfirm={onConfirmFunc}
            animationType="slide"
          />
        </View>
    )
  }

  const handleAlcoholTimePress = (): void => {
    setSelectedTimeModal("alcohol");
    setVisible(true);
  }

  const handleCaffieneTimePress = (): void => {
    setSelectedTimeModal("caffiene");
    setVisible(true);
  }

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
              right={() => (
                <Text
                  variant="bodyLarge"
                  theme={{ colors: { onSurface: "gray" } }}
                >
                  Add
                </Text>
              )}
            />
          <List.Item
            title="When did you have your last drink"
            right={() => (
              <Pressable onPress={handleAlcoholTimePress}>
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
              right={() => (
                <Text
                  variant="bodyLarge"
                  theme={{ colors: { onSurface: "gray" } }}
                >
                  Add
                </Text>
              )}
            />
          </Pressable>
          <List.Item
            title="When did you have your last drink"
            right={() => (
              <Pressable onPress={handleCaffieneTimePress}>
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
