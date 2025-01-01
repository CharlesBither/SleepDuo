import { Text, View, StyleSheet } from "react-native";
import { useState } from "react";
import { PaperProvider } from 'react-native-paper';

import SleepOverview from "@/components/SleepOverview";
import initializeHealthConnect from "@/health-connect/initialize";
import { getSleepData } from "@/health-connect/sleep-data";
import { SleepRecordInfo } from "@/health-connect/SleepRecordInfo";



export default function Index() {
  const [sleepRecordInfoArray, setSleepRecordInfoArray] = useState<SleepRecordInfo[]>([]);

  //init health-connect SDK
  initializeHealthConnect()
    .then(() => {
      // get sleep records from previous 14 days
      getSleepData().then((data) => {
        let arr: SleepRecordInfo[] = [];
        const records = data.records;
        for (let i = 0; i < records.length; i++) {
          const currSleepRecordInfo = new SleepRecordInfo(records[i]);
          arr.push(currSleepRecordInfo);
        }

        if (arr.length != sleepRecordInfoArray.length) {
          setSleepRecordInfoArray(arr);
        }
        

      }).catch(() => {
        console.log("could not get sleep data");
    });
  }).catch(() => {
    console.log("could not initialize hc");
  })

  if (sleepRecordInfoArray) {
    return (
      <PaperProvider>
        <View style={styles.container}>
          <SleepOverview sleepRecordInfo={sleepRecordInfoArray}/>
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