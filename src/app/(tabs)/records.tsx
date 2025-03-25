import { useState } from 'react';
import { Text } from 'react-native-paper';

import { SleepDuoRecord } from '@/src/records/SleepDuoRecord';
import initializeHealthConnect from '@/src/health-connect/initialize';
import { getSleepData } from '@/src/health-connect/sleep-data';
import { SleepRecord } from '@/src/records/SleepRecord';
import RecordsList from '@/src/app/components/RecordsList';
import ThemedView from '@/src/app/components/ThemedView';

export default function RecordsScreen() {
  const [recordsArray, setRecordsArray] = useState<SleepDuoRecord[]>([]);

  // connect to Health-Connect API and create a list of recent sleep records
  initializeHealthConnect()
    .then(() => {

      // get sleep records from previous 14 days
      getSleepData().then((data) => {
        let arr: SleepDuoRecord[] = [];

        const records = data.records;
        for (let i = 0; i < records.length; i++) {
          const currSleepActivity = new SleepRecord(records[i]);
          arr.push(currSleepActivity);
        }

        if (arr.length != recordsArray.length) {
          setRecordsArray(arr);
        }
      }).catch(() => {
        console.log("could not get sleep data");
      });

    }).catch(() => {
      console.log("could not initialize hc");
    })

  if (recordsArray) {
    return (
      <ThemedView>
        <RecordsList recordArray={recordsArray} />
      </ThemedView>
    );
  }

  return (
    <ThemedView>
      <Text>empty arr</Text>
    </ThemedView>
  );
}