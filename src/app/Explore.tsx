import { useState } from "react";
import { Button, Divider, List, Text } from "react-native-paper";
import ExploreModal from "../components/modals/ExploreModal";
import ThemedView from "../views/ThemedView";
import { SleepSessionFilter } from "../types/SleepSessionFilter";
import { SleepSessionAvgData } from "../types/SleepSessionAvgData";
import { getAverageSleepEfficiency, getAverageTimeInBed, getAverageTimeInStage, getAverageTst, getSleepSessionArraysByFilter } from "../utils/sleepSession";
import SleepSessionAvgDataSection from "../components/listSections/SleepSessionAvgDataSection";
import { StyleSheet } from "react-native";
import { setErrorMsg } from "../stores/error";
import { useRouter } from "expo-router";

export default function Explore() {
  const [activity, setActivity] = useState<SleepSessionFilter | "">("");
  const [filterType, setFilterType] = useState<"included" | "excluded">("included");
  const [modalVisible, setModalVisible] = useState(false);
  const [details, setDetails] = useState<SleepSessionAvgData | undefined>(undefined);
  const router = useRouter();

  const getFilteredDetails = async (activity: SleepSessionFilter, filterType: "included" | "excluded"): Promise<SleepSessionAvgData | undefined> => {
    const filteredArrays = await getSleepSessionArraysByFilter(activity);
    const sleepArray = filterType === "included" ? filteredArrays[0] : filteredArrays[1];
    return {
      totalSleepTime: getAverageTst(sleepArray),
      timeInBed: getAverageTimeInBed(sleepArray),
      sleepEfficiency: getAverageSleepEfficiency(sleepArray),
      timeLightSleep: getAverageTimeInStage(sleepArray, "light"),
      timeDeepSleep: getAverageTimeInStage(sleepArray, "deep"),
      timeRemSleep: getAverageTimeInStage(sleepArray, "rem"),
    };
  }

  const handleActivityChange = async (activity: SleepSessionFilter): Promise<void> => {
    try {
      const newDetails = await getFilteredDetails(activity, filterType)
      setDetails(newDetails);
      setActivity(activity);
    } catch (error) {
      setErrorMsg("An unexpected error occurred at handleActivityChange " + error);
      router.replace("/ErrorScreen");
    }
  }

  const handleFilterChange = async (): Promise<void> => {
    if (activity === "") return;
    try {
      const newFilterType = filterType === "included" ? "excluded" : "included";
      const newDetails = await getFilteredDetails(activity, newFilterType)
      setDetails(newDetails);
      setFilterType(newFilterType);
    } catch (error) {
      setErrorMsg("An unexpected error occurred at handleFilterChange " + error);
      router.replace("/ErrorScreen");
    }
  }

  const renderFilterStatement = (): JSX.Element => {
    if (filterType === "included") {
      return <Text variant="titleMedium" style={styles.title}>{`On days where you had ${activity}...`}</Text>;
    }
    return <Text variant="titleMedium" style={styles.title}>{`On days where you didn't have ${activity}...`}</Text>
  }

  if (activity === "") {
    return (
      <ThemedView>
        <List.Section>
          <List.Subheader>Selected activity</List.Subheader>
          <List.Item
            title="None selected"
            description="Click the button to select an activity"
            right={() => (
              <Button onPress={() => setModalVisible(true)}>
                Select activity
              </Button>
            )}
          />
          <List.Item
            title={`Filter type: ${filterType}`}
            description="Click the button to switch the filter type"
            right={() => (
              <Button onPress={handleFilterChange}>
                Switch filter
              </Button>
            )}
          />
        </List.Section>
        <Divider />
        <ExploreModal
          activity={activity}
          visible={modalVisible}
          onActivityChange={handleActivityChange}
          setVisible={setModalVisible}
        />
      </ThemedView>
    );
  }
  return (
    <ThemedView>
      <List.Section>
        <List.Subheader>Explore settings</List.Subheader>
        <List.Item
          title={`Activity: ${activity}`}
          description="Click the button to change activity"
          right={() => (
            <Button onPress={() => setModalVisible(true)}>
              Change activity
            </Button>
          )}
        />
        <List.Item
          title={`Filter type: ${filterType}`}
          description="Click the button to switch the filter type"
          right={() => (
            <Button onPress={handleFilterChange}>
              Switch filter
            </Button>
          )}
        />
        <Divider />
      </List.Section>
      {renderFilterStatement()}
      <SleepSessionAvgDataSection data={details} />
      <ExploreModal
        activity={activity}
        visible={modalVisible}
        onActivityChange={handleActivityChange}
        setVisible={setModalVisible}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginLeft: 15,
    marginTop: 10,
  }
})