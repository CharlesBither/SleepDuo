import React from 'react';
import { View, ScrollView } from 'react-native';
import { Divider, List } from 'react-native-paper';

import { SleepRecord } from "@/src/records/SleepRecord";
import { SleepDuoRecord } from '@/src/records/SleepDuoRecord';
import { DateFormatter } from '../../utils/DateFormatter';

type Props = {
    recordArray: SleepDuoRecord[],
};

/*
 * returns a list of records that will be displayed in '/(tabs)/records'
 */
export default function RecordsList({ recordArray: recordArray }: Props) {
    const dateFormatter = new DateFormatter()

    const records = recordArray.map((currRecord) => {
        if (currRecord instanceof SleepRecord) {
            const sleepTime = currRecord.totalSleepTime;
            const sleepDescription: String = DateFormatter.getHours(sleepTime) + "h " + DateFormatter.getMinutes(sleepTime) + "m asleep";
            
            return (
                <View key={currRecord.endTime.toJSON()}> 
                    <List.Section>
                        <List.Subheader>{DateFormatter.getLocalDate(currRecord.endTime, dateFormatter.getTimeZone())}</List.Subheader>
                        <List.Item
                            right={(props) => <List.Icon {...props} icon="sleep" />}
                            title="Sleep"
                            description={sleepDescription}
                        />
                    </List.Section>
                    <Divider />
                </View>
            )
        }
    });

    return (
        <ScrollView>
            {records}
        </ScrollView>
    );
}