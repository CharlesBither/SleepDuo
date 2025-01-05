import { Text, View, StyleSheet } from "react-native";
import { useState } from "react";
import { PaperProvider } from 'react-native-paper';
import { getLocales, getCalendars } from 'expo-localization';
import { useTheme } from "react-native-paper";

import Journal from "@/components/Journal";
import initializeHealthConnect from "@/health-connect/initialize";
import { getSleepData } from "@/health-connect/sleep-data";
import { SleepActivity } from "@/activities/SleepActivity";
import { Activity } from "@/activities/Activity";
import Button from "@/components/Button";

export default function Index() {
  const theme = useTheme();
  // const [ActivityArray, setActivityArray] = useState<Activity[]>([]);

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

      }).catch(() => {
        console.log("could not get sleep data");
    });
  }).catch(() => {
    console.log("could not initialize hc");
  })

  return (
      <View style={{ 
        backgroundColor: theme.colors.background,
        flex: 1
         }}>
        <Button label="Log an activity"></Button>
      </View>
  );
}