import { useState } from 'react';
import { Text } from 'react-native-paper';

import { Activity } from '@/src/activities/Activity';
import initializeHealthConnect from '@/src/health-connect/initialize';
import { getSleepData } from '@/src/health-connect/sleep-data';
import { SleepActivity } from '@/src/activities/SleepActivity';
import Journal from '@/src/components/Journal';
import { useTheme } from 'react-native-paper';
import ThemedView from '@/src/components/ThemedView';

export default function JournalScreen() {
    const [ActivityArray, setActivityArray] = useState<Activity[]>([]);
    const theme = useTheme();
    
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
            <ThemedView>
                <Journal Activity={ActivityArray}/>
            </ThemedView>
      );
    }
  
    return (
      <ThemedView>
        <Text>empty arr</Text>
      </ThemedView>
    );
}