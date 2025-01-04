import { Text, View, StyleSheet } from "react-native";
import { useState } from "react";
import { PaperProvider } from 'react-native-paper';
import { getLocales, getCalendars } from 'expo-localization';

import Journal from "@/components/Journal";
import initializeHealthConnect from "@/health-connect/initialize";
import { getSleepData } from "@/health-connect/sleep-data";
import { SleepActivity } from "@/activities/SleepActivity";
import { Activity } from "@/activities/Activity";



export default function Index() {
  const [ActivityArray, setActivityArray] = useState<Activity[]>([]);

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

        if (arr.length != ActivityArray.length) {
          setActivityArray(arr);
        }
        

      }).catch(() => {
        console.log("could not get sleep data");
    });
  }).catch(() => {
    console.log("could not initialize hc");
  })

  if (ActivityArray) {
    return (
      <PaperProvider>
        <View style={styles.container}>
          <Journal Activity={ActivityArray}/>
        </View>
      </PaperProvider>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>empty arr</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#25292e',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});