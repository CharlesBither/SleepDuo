import { Text, View, StyleSheet } from "react-native";
import {
  initialize,
  requestPermission,
  readRecords,
} from 'react-native-health-connect';
import SleepOverview from "../components/SleepOverview";

const getBeginningOfLast14Days = () => {
  const date = new Date();
  date.setDate(date.getDate() - 14);
  date.setHours(0, 0, 0, 0);
  return date;
};

const now = () => {
  return new Date();
};

const readSampleData = async () => {
  // initialize the client
  const isInitialized = await initialize();

  // request permissions
  const requestSamplePermissions = () => {
    requestPermission([
      {
        accessType: 'read',
        recordType: 'SleepSession',
      },
    ]).then((permissions) => {
      console.log('Granted permissions on request ', { permissions });
    });
  };

  // check if granted
  requestSamplePermissions();

  const read = () => {
    readRecords('SleepSession', {
      timeRangeFilter: {
        operator: 'between',
        startTime: getBeginningOfLast14Days().toISOString(),
        endTime: now().toISOString(),
      },
    })
      .then((result) => {
        console.log('Retrieved records: ', JSON.stringify({ result }, null, 2));
      })
      .catch((err) => {
        console.error('Error reading records ', { err });
      });
  };

  read();
};

export default function Index() {
  const data = readSampleData();
  // console.log(data);
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