import { useState } from "react";
import { getLocales, getCalendars } from 'expo-localization';
import { StyleSheet, Pressable } from "react-native";
import { useTheme, Text, List } from "react-native-paper";

import initializeHealthConnect from "@/src/health-connect/initialize";
import { getSleepData } from "@/src/health-connect/sleep-data";
import { SleepActivity } from "@/src/activities/SleepActivity";
import { Activity } from "@/src/activities/Activity";
import { DateFormatter } from "@/src/utils/DateFormatter";
import ThemedView from '@/src/components/ThemedView';
import OverviewRouteButton from "../components/OverviewRouteButton";
import { Link } from 'expo-router';

export default function Index() {
  const [sleepArray, setSleepArray] = useState<Activity[]>([]);
  
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

        if (arr.length != sleepArray.length && arr.length !== 0) {
          console.log("calling setSleepArray. Arr length = " + arr.length);
          setSleepArray(arr);
        }
      }).catch(() => {
        console.log("could not get sleep data");
    });
  }).catch(() => {
    console.log("could not initialize hc");
  })

  const currAverageTST = SleepActivity.getAverageTST(sleepArray);
  const averageTSTDescription = DateFormatter.getHours(currAverageTST) + "h " + DateFormatter.getMinutes(currAverageTST) + "m";
  console.log("SA length = " + sleepArray.length + " and avg TST = " + SleepActivity.getAverageTST(sleepArray));
  return (
      <ThemedView>
          <OverviewRouteButton label="Go Home" />
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  Text: {
    textAlign: 'center'
  }
})