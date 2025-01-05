import { useState } from "react";
import { getLocales, getCalendars } from 'expo-localization';
import { StyleSheet } from "react-native";
import { useTheme, Text, List } from "react-native-paper";

import initializeHealthConnect from "@/src/health-connect/initialize";
import { getSleepData } from "@/src/health-connect/sleep-data";
import { SleepActivity } from "@/src/activities/SleepActivity";
import { Activity } from "@/src/activities/Activity";
import ThemedView from '@/src/components/ThemedView';

export default function Index() {
  const theme = useTheme();
  const [sleepArray, setSleepArray] = useState<Activity[]>([]);
  const [averageTST, setAverageTST] = useState<number>(0);
  const averageTSTDescription = SleepActivity.getAverageHours(averageTST) + "h " + SleepActivity.getAverageHours(averageTST) + "m";

  //init health-connect SDK
  initializeHealthConnect()
    .then(() => {
      // get sleep records from previous 14 days
      getSleepData().then((data) => {
        let arr: Activity[] = [];
        const records = data.records;
        for (let i = 0; i < records.length; i++) {
          const currSleepActivity = new SleepActivity(records[i]);
          arr.push(currSleepActivity);
        }

        if (arr.length != sleepArray.length) {
          setSleepArray(arr);
        }

        const currAverageTST = SleepActivity.getAverageTST(sleepArray);
        if (currAverageTST != averageTST) {
          setAverageTST(currAverageTST);
        }
        

      }).catch(() => {
        console.log("could not get sleep data");
    });
  }).catch(() => {
    console.log("could not initialize hc");
  })

  return (
      <ThemedView>
        <Text variant="displayMedium" style={styles.Text}>Overview</Text>
        <List.Section>
          <List.Subheader>Last 14 days</List.Subheader>
          <List.Item 
            title="Total Sleep Time"
            description={averageTSTDescription} />
        </List.Section>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  Text: {
    textAlign: 'center'
  }
})