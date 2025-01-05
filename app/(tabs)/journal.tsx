import { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { Activity } from '@/activities/Activity';
import initializeHealthConnect from '@/health-connect/initialize';
import { getSleepData } from '@/health-connect/sleep-data';
import { SleepActivity } from '@/activities/SleepActivity';
import Journal from '@/components/Journal';
import { useTheme } from 'react-native-paper';

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
            <View style={{ backgroundColor: theme.colors.background }}>
                <Journal Activity={ActivityArray}/>
            </View>
      );
    }
  
    return (
      <View style={styles.container}>
        <Text>empty arr</Text>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#25292e',
  },
});
