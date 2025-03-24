import { useState } from "react";
import { StyleSheet } from "react-native";
import { List } from "react-native-paper";

import initializeHealthConnect from "@/src/health-connect/initialize";
import { getSleepData } from "@/src/health-connect/sleep-data";
import { SleepRecord } from "@/src/records/SleepRecord";
import { Record } from "@/src/records/Record";
import { DateFormatter } from "@/src/utils/DateFormatter";
import ThemedView from '@/src/app/components/ThemedView';
import RouteButton from "@/src/app/components/Button/RouteButton";

export default function Home() {
  const [sleepArray, setSleepArray] = useState<Record[]>([]);

  //init health-connect SDK
  initializeHealthConnect()
    .then(() => {
      // get sleep records from previous 14 days
      getSleepData().then((data) => {
        let arr: Record[] = [];
        const records = data.records;
        for (let i = 0; i < records.length; i++) {
          const currSleepActivity = new SleepRecord(records[i]);
          arr.push(currSleepActivity);
        }

        if (arr.length != sleepArray.length && arr.length !== 0) {
          setSleepArray(arr);
        }
      }).catch(() => {
        console.log("could not get sleep data");
      });
    }).catch(() => {
      console.log("could not initialize hc");
    })

  const currAverageTST = SleepRecord.getAverageTST(sleepArray);
  const averageTSTDescription = DateFormatter.getHours(currAverageTST) + "h " + DateFormatter.getMinutes(currAverageTST) + "m";
  return (
    <ThemedView>
      <List.Section>
        <List.Subheader>Last 14 days</List.Subheader>
        <List.Item
          title="Total Sleep Time"
          description={averageTSTDescription} />
      </List.Section>
      <RouteButton label='add activity' path='/components/pages/AddActivity' />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  Text: {
    textAlign: 'center'
  }
})