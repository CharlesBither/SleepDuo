import { useState } from "react";
import { StyleSheet } from "react-native";
import { Text, List } from "react-native-paper";

import initializeHealthConnect from "@/src/health-connect/initialize";
import { getSleepData } from "@/src/health-connect/sleep-data";
import { SleepActivity } from "@/src/activities/SleepActivity";
import { Activity } from "@/src/activities/Activity";
import { DateFormatter } from "@/src/utils/DateFormatter";
import ThemedView from '@/src/components/ThemedView';

export default function Home() {
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