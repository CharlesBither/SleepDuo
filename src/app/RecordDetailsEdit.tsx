import {
  getRecordDetails,
  insertRecordDetails,
} from "@/src/database/recordDetails";
import { useEffect, useState } from "react";
import {
  Dialog,
  Portal,
  Text,
  Button,
  useTheme,
  Divider,
  ActivityIndicator,
  List,
} from "react-native-paper";
import { SleepRecord } from "../types/SleepRecord";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import ThemedView from "../views/ThemedView";
import LoadingScreen from "./LoadingScreen";
import { Pressable } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { RecordDetails } from "../types/RecordDetails";
import { getId } from "../database/auth";
import { StyleSheet } from "react-native";
import { readRecord } from "react-native-health-connect";
import AlcoholItem from "../components/listSections/RecordDetails/AlcoholItem";
import CaffeineItem from "../components/listSections/RecordDetails/CaffeineItem";
import { constructSleepRecord, getSleepRecordFromReadRecord } from "../utils/SleepRecord";
import { TimeOfDay } from "../types/TimeOfDay";
import { QualityOfSleep } from "../types/QualityOfSleep";
import AfterSleepSection from "../components/listSections/RecordDetails/AfterSleepSection";
import NapItem from "../components/listSections/RecordDetails/NapItem";
import { HadNapValue } from "../types/HadNapValue";
import { setErrorMsg } from "../stores/error";

let record: SleepRecord | undefined = undefined;

export default function RecordDetailsEdit() {
  const { guid } = useLocalSearchParams<{ guid: string }>();
  const details = getRecordDetails(guid);
  const theme = useTheme();
  const router = useRouter();

  const [record, setRecord] = useState<SleepRecord | undefined>(undefined);
  const [alcoholTime, setAlcoholTime] = useState<TimeOfDay>("NA");
  const [caffeineTime, setCaffeineTime] = useState<TimeOfDay>("NA");
  const [alcoholQuantity, setAlcoholQuantity] = useState<string>(details ? details.alcohol_quantity : "0");
  const [caffeineQuantity, setCaffeineQuantity] = useState<string>(details ? details.caffeine_quantity : "0");
  const [hadNap, setHadNap] = useState<HadNapValue>(details ? details.had_nap : "no");
  const [qualityOfSleep, setQualityOfSleep] = useState<QualityOfSleep>(details ? details.quality_of_sleep : "5");

  const [loading, setLoading] = useState<boolean>(true);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [dialogIsVisible, setDialogIsVisible] = useState<boolean>(false);
  const [dialogMsg, setDialogMsg] = useState<string>("");

  useEffect(() => {
      getSleepRecordFromReadRecord(guid)
        .then(sleepRecord => {
          setRecord(sleepRecord);
          setLoading(false);
        })
        .catch(e => {
          setErrorMsg("RecordDetailsEdit useEffect threw error: " + e);
          router.replace("/ErrorScreen");
        })
    }, []);

  const requiredFieldsAreValid = (): boolean => {
    return !(alcoholQuantity !== "0" && alcoholTime === "NA" || caffeineQuantity !== "0" && caffeineTime === "NA");
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
      <Pressable onPress={async () => await handleSavePress()}>
        <FontAwesome name="save" size={24} color={theme.colors.onBackground} />
      </Pressable>
    );
  };

  /** Called when the user tries to save a journal record.
   * Inserts the record into the journal_records database table.
   */
  const handleSavePress = async (): Promise<void> => {
    if (!requiredFieldsAreValid()) {
        setDialogMsg("You must input a time for your drinks if the quantity is non-zero.");
        setDialogIsVisible(true);
        return;
    }
    setSaveLoading(true);

    try {
      const uuid = await getId();
      const newDetails: RecordDetails = {
        created_at: new Date(),
        uuid: uuid,
        guid: guid,
        alcohol_quantity: alcoholQuantity,
        alcohol_time: alcoholTime,
        caffeine_quantity: caffeineQuantity,
        caffeine_time: caffeineTime,
        had_nap: hadNap,
        quality_of_sleep: qualityOfSleep,
      };

      await insertRecordDetails(newDetails);
      router.back();
    } catch(e) {
      setErrorMsg("handleSavePress threw error: " + e);
      router.replace("/ErrorScreen");
    }
    
  };

  if (loading) {
    return (
      <ThemedView>
        <LoadingScreen />
      </ThemedView>
    );
  } else if (!record) {
    setErrorMsg("record is undefined");
    router.replace("/ErrorScreen");
    return;
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
        <List.Subheader>Before sleep</List.Subheader>
        <CaffeineItem
          caffeineQuantity={caffeineQuantity}
          caffeineTime={caffeineTime}
          setCaffeineQuantity={setCaffeineQuantity}
          setCaffeineTime={setCaffeineTime}
        />
        <Divider />

        <AlcoholItem
          alcoholQuantity={alcoholQuantity}
          alcoholTime={alcoholTime}
          setAlcoholQuantity={setAlcoholQuantity}
          setAlcoholTime={setAlcoholTime}
        />
        <Divider />

        <NapItem value={hadNap} setValue={setHadNap} />
      </List.Section>
      
      <Divider />
      <AfterSleepSection quality={qualityOfSleep} setQuality={setQualityOfSleep} />
      <Divider />


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
