import { Text, View, StyleSheet } from "react-native";

import SleepOverview from "@/components/SleepOverview";
import initializeHealthConnect from "@/health-connect/initialize";
import { getSleepData } from "@/health-connect/sleep-data";

const logSleepData = async () => {
  await initializeHealthConnect();
  const data = await getSleepData();
  console.log('Retrieved records: ', JSON.stringify(data, null, 2));
}

export default function Index() {
  logSleepData();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
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