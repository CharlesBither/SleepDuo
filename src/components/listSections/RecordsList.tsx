import React from 'react';
import { View, ScrollView } from 'react-native';
import { Divider, List } from 'react-native-paper';

import { SleepRecord } from "@/src/records/SleepRecord";
import { SleepDuoRecord } from '@/src/records/SleepDuoRecord';
import { router } from 'expo-router';
import { getHours, getLocalDate, getMinutes, getTimeZone } from '../../utils/dates';

type Props = {
    recordArray: SleepDuoRecord[],
};

/*
 * returns a list of records that will be displayed in '/(tabs)/records'
 */
export default function RecordsList({ recordArray: recordArray }: Props) {

    const handlePress = (guid: string | undefined): void => {
        if (guid) {
            router.push(`/RecordDetailsRead?guid=${guid}`);
        }
    }

    const records = recordArray.map((currRecord) => {
        if (currRecord instanceof SleepRecord) {
            const sleepTime = currRecord.totalSleepTime;
            const sleepDescription: String = getHours(sleepTime) + "h " + getMinutes(sleepTime) + "m asleep" + "; id: " + currRecord.id;
            
            return (
                <View key={currRecord.endTime.toJSON()}> 
                    <List.Section>
                        <List.Subheader>{getLocalDate(currRecord.endTime, getTimeZone())}</List.Subheader>
                        <List.Item
                            right={(props) => <List.Icon {...props} icon="sleep" />}
                            title="Sleep"
                            description={sleepDescription}
                            onPress={() => handlePress(currRecord.id)}
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