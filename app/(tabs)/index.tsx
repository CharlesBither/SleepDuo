import { Text, View, StyleSheet } from "react-native";
import { useState } from "react";

import SleepOverview from "@/components/SleepOverview";
import initializeHealthConnect from "@/health-connect/initialize";
import { getSleepData } from "@/health-connect/sleep-data";
import { SleepRecordInfo } from "@/health-connect/SleepRecordInfo";

export default function Index() {
  const [timeInBed, setTimeInBed] = useState<number>(0);
  const [totalSleepTime, setTotalSleepTime] = useState<number>(0);
  const [sleepEfficiency, setSleepEfficiency] = useState<String>("0");

  //init health-connect SDK
  initializeHealthConnect()
    .then(() => {
      // get sleep records from previous 14 days
      getSleepData().then((data) => {
        const lastSleepRecord = data.records[data.records.length - 1];
        console.log(JSON.stringify(lastSleepRecord, null, 2));
        const lastSleepRecordInfo = new SleepRecordInfo(lastSleepRecord);
        setTimeInBed(lastSleepRecordInfo.timeInBed);
        setTotalSleepTime(lastSleepRecordInfo.totalSleepTime);
        setSleepEfficiency(lastSleepRecordInfo.sleepEfficiency);
      }).catch(() => {
        console.log("could not get sleep data");
    });
  }).catch(() => {
    console.log("could not initialize hc");
  })

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
      <Text style={styles.text}>Time in bed : { timeInBed } ms</Text>
      <Text style={styles.text}>Total sleep time : { totalSleepTime } ms</Text>
      <Text style={styles.text}>Sleep efficiency : { sleepEfficiency } %</Text>
      <SleepOverview />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});