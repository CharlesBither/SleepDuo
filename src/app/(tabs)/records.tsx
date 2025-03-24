import { useState } from 'react';
import { Text } from 'react-native-paper';

import { Record } from '@/src/records/Record';
import initializeHealthConnect from '@/src/health-connect/initialize';
import { getSleepData } from '@/src/health-connect/sleep-data';
import { SleepRecord } from '@/src/records/SleepRecord';
import Journal from '@/src/app/components/Records';
import ThemedView from '@/src/app/components/ThemedView';

export default function RecordsScreen() {
  const [activityArray, setActivityArray] = useState<Record[]>([]);

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

        if (arr.length != activityArray.length) {
          setActivityArray(arr);
        }

      }).catch(() => {
        console.log("could not get sleep data");
      });
    }).catch(() => {
      console.log("could not initialize hc");
    })

  if (activityArray) {
    return (
      <ThemedView>
        <Journal recordArray={activityArray} />
      </ThemedView>
    );
  }

  return (
    <ThemedView>
      <Text>empty arr</Text>
    </ThemedView>
  );
}