import { useEffect, useState } from "react";
import { Button, Divider, List, Text } from "react-native-paper";
import ExploreModal from "../components/modals/ExploreModal";
import ThemedView from "../components/ThemedView";
import { SleepRecordFilter } from "../types/SleepRecordFilter";
import { OverviewDetails } from "../types/OverviewDetails";
import { getAverageSleepEfficiency, getAverageTimeInBed, getAverageTimeInStage, getAverageTst, getSleepRecordArraysByFilter } from "../utils/SleepRecord";
import ExploreDataSection from "../components/listSections/ExploreDataSection";

export default function Explore() {
  const [activity, setActivity] = useState<SleepRecordFilter | "">("");
  const [filterType, setFilterType] = useState<"included" | "excluded">("included");
  const [modalVisible, setModalVisible] = useState(false);
  const [details, setDetails] = useState<OverviewDetails | undefined>(undefined);

  useEffect(() => {
    if (activity !== "") {
      getSleepRecordArraysByFilter(activity)
        .then(arrays => {
          const sleepArray = filterType === "included" ? arrays[0] : arrays[1];
          setDetails({
            totalSleepTime: getAverageTst(sleepArray),
            timeInBed: getAverageTimeInBed(sleepArray),
            sleepEfficiency: getAverageSleepEfficiency(sleepArray),
            timeLightSleep: getAverageTimeInStage(sleepArray, "light"),
            timeDeepSleep: getAverageTimeInStage(sleepArray, "deep"),
            timeRemSleep: getAverageTimeInStage(sleepArray, "rem"),
          })
        })

    }

  })

  const renderActivityTitle = (): string => {
    return `Activity: ${activity}`;
  }

  const renderFilterType = (): string => {
    return `Filter type: ${filterType}`;
  }

  const handleSwitchPress = (): void => {
    setFilterType(filterType === "included" ? "excluded" : "included");
  }

  const renderFilterStatement = (): JSX.Element => {
    if (filterType === "included") {
      return <Text>{`On days where you had ${activity}...`}</Text>;
    }
    return <Text>{`On days where you didn't have ${activity}...`}</Text>
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
            title={renderFilterType()}
            description="Click the button to switch the filter type"
            right={() => (
              <Button onPress={handleSwitchPress}>
                Change activity
              </Button>
            )}
          />
        </List.Section>
        <Divider />
        <ExploreModal
          activity={activity}
          visible={modalVisible}
          setActivity={setActivity}
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
          title={renderActivityTitle()}
          description="Click the button to change activity"
          right={() => (
            <Button onPress={() => setModalVisible(true)}>
              Change activity
            </Button>
          )}
        />
        <List.Item
          title={renderFilterType()}
          description="Click the button to switch the filter type"
          right={() => (
            <Button onPress={handleSwitchPress}>
              Change activity
            </Button>
          )}
        />
        <Divider />
      </List.Section>
      {renderFilterStatement()}
      <ExploreDataSection details={details} />
      <ExploreModal
        activity={activity}
        visible={modalVisible}
        setActivity={setActivity}
        setVisible={setModalVisible}
      />
    </ThemedView>
  );
}
