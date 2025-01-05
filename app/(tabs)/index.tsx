import { useState } from "react";
import { getLocales, getCalendars } from 'expo-localization';
import { useTheme, Text } from "react-native-paper";

import initializeHealthConnect from "@/health-connect/initialize";
import { getSleepData } from "@/health-connect/sleep-data";
import { SleepActivity } from "@/activities/SleepActivity";
import { Activity } from "@/activities/Activity";
import ThemedView from '@/components/ThemedView';

export default function Index() {
  const theme = useTheme();
  const [activityArray, setActivityArray] = useState<Activity[]>([]);

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

        if (arr.length != activityArray.length) {
          setActivityArray(arr);
        }

      }).catch(() => {
        console.log("could not get sleep data");
    });
  }).catch(() => {
    console.log("could not initialize hc");
  })

  return (
      <ThemedView>
        <Text>Test</Text>
      </ThemedView>
  );
}