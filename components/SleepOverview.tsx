import React from 'react';
import { Text, View, type TextProps, StyleSheet, ScrollView } from 'react-native';
import { Divider, List, MD3Colors } from 'react-native-paper';

import { SleepRecordInfo } from "@/health-connect/SleepRecordInfo";

type Props = {
    sleepRecordInfo: SleepRecordInfo[], 
};

export default function SleepOverview({ sleepRecordInfo }: Props) {

    const records = sleepRecordInfo.map((record) => {
        const sleepDescription: String = record.getHours() + "h " + record.getMinutes() + "m asleep"
        return (
            <View key={record._record.endTime}>
                <List.Section>
                    <List.Subheader>DATE</List.Subheader>
                    <List.Item
                        right={(props) => <List.Icon {...props} icon="sleep" />}
                        title="Sleep"
                        description={ sleepDescription }
                    />
                    {/* <View key={record._record.endTime} style={styles.container}>
                        <Text style={styles.text}>Time in bed : { record.timeInBed } ms</Text>
                        <Text style={styles.text}>Total sleep time : { record.totalSleepTime } ms</Text>
                        <Text style={styles.text}>Sleep efficiency : { record.sleepEfficiency } %</Text>
                    </View> */}
                </List.Section>
                <Divider />
            </View>
        )    
    });

    return (
        <ScrollView>
            {records}
        </ScrollView>
    );
}

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: '#25292e',
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     text: {
//       color: '#fff',
//     },
//   });