import { useState } from 'react';
import { Button, Divider, List, Text } from 'react-native-paper';
import ExploreModal from '../components/modals/ExploreModal';
import ThemedView from '../views/ThemedView';
import { SleepSessionActivity } from '../types/SleepSessionActivity';
import { SleepSessionAvgData } from '../types/SleepSessionAvgData';
import {
  getNapFilteredSleepSessions,
  getTimeOfDayFilteredSleepSessions,
  sleepSessionArrayToAvgData,
} from '../utils/sleepSession';
import SleepSessionAvgDataSection from '../components/listSections/SleepSessionAvgDataSection';
import { StyleSheet } from 'react-native';
import ExploreNapFilterModal from '../components/modals/ExploreNapFilterModal';
import { BooleanFilter } from '../types/BooleanFilter';
import FilterItem from '../components/listSections/explore/FilterItem';
import { TimeOfDay } from '../types/TimeOfDay';
import ExploreTimeOfDayFilterModal from '../components/modals/ExploreTimeOfDayFilterModal';
import { renderFilterStatement } from '../utils/textFormatter';

export default function Explore() {
  const [activity, setActivity] = useState<SleepSessionActivity | ''>('');
  const [napFilter, setNapFilter] = useState<BooleanFilter | ''>('');
  const [timeOfDayFilter, setTimeOfDayFilter] = useState<TimeOfDay[]>([]);
  const [data, setData] = useState<SleepSessionAvgData | undefined>(undefined);

  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [napFilterModalVisible, setNapFilterModalVisible] = useState(false);
  const [timeOfDayFilterModalVisible, setTimeOfDayFilterModalVisible] =
    useState(false);

  const handleActivityChange = (activityParam: SleepSessionActivity): void => {
    if (activityParam === activity) return;
    setData(undefined);
    setTimeOfDayFilter([]);
    setNapFilter('');
    setActivity(activityParam);
  };

  const handleNapFilterChange = async (
    napFilterParam: BooleanFilter
  ): Promise<void> => {
    if (napFilterParam === napFilter) return;
    try {
      setNapFilter(napFilterParam);
      const filteredSleepSessions =
        await getNapFilteredSleepSessions(napFilterParam);
      setData(sleepSessionArrayToAvgData(filteredSleepSessions));
    } catch (error) {
      console.error(
        'handleNapFilterChange threw an unexpected error: ' + error
      );
    }
  };

  const handleTimeOfDayFilterChange = async (
    filterParam: TimeOfDay[]
  ): Promise<void> => {
    if (activity === 'alcohol' || activity === 'caffeine') {
      try {
        setTimeOfDayFilter(filterParam);
        const filteredSleepSessions = await getTimeOfDayFilteredSleepSessions(
          activity,
          filterParam
        );
        setData(sleepSessionArrayToAvgData(filteredSleepSessions));
      } catch (error) {
        console.error(
          'handleNapFilterChange threw an unexpected error: ' + error
        );
      }
    }
  };

  const handleFilterChangeButtonPress = (): void => {
    if (activity === '') return;
    else if (activity === 'nap') setNapFilterModalVisible(true);
    else setTimeOfDayFilterModalVisible(true);
  };

  return (
    <ThemedView>
      <List.Section>
        <List.Subheader>Explore settings</List.Subheader>
        <List.Item
          title={`Activity: ${activity}`}
          description="Click the button to change activity"
          right={() => (
            <Button onPress={() => setActivityModalVisible(true)}>
              Change activity
            </Button>
          )}
        />
        <FilterItem
          activity={activity}
          onFilterChangeButtonPress={handleFilterChangeButtonPress}
          napFilter={napFilter}
          timeOfDayFilter={timeOfDayFilter}
        />
        <Divider />
      </List.Section>
      <Text style={styles.title}>
        {renderFilterStatement(activity, napFilter, timeOfDayFilter)}
      </Text>
      <SleepSessionAvgDataSection data={data} />

      <ExploreModal
        activity={activity}
        visible={activityModalVisible}
        onActivityChange={handleActivityChange}
        setVisible={setActivityModalVisible}
      />
      <ExploreNapFilterModal
        filter={napFilter}
        visible={napFilterModalVisible}
        onFilterChange={handleNapFilterChange}
        setVisible={setNapFilterModalVisible}
      />
      <ExploreTimeOfDayFilterModal
        filter={timeOfDayFilter}
        visible={timeOfDayFilterModalVisible}
        onFilterChange={handleTimeOfDayFilterChange}
        setVisible={setTimeOfDayFilterModalVisible}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginLeft: 15,
    marginTop: 10,
  },
});
