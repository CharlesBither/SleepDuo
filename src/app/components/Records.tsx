import React from 'react';
import { View, ScrollView } from 'react-native';
import { Divider, List } from 'react-native-paper';

import { SleepRecord } from "@/src/records/SleepRecord";
import { Record } from '@/src/records/Record';
import { DateFormatter } from '../../utils/DateFormatter';

type Props = {
    recordArray: Record[],
};

export default function Journal({ recordArray: activityArray }: Props) {

    const activities = activityArray.map((currActivity) => {
        if (currActivity instanceof SleepRecord) {
            const sleepTime = currActivity.totalSleepTime;
            const sleepDescription: String = DateFormatter.getHours(sleepTime) + "h " + DateFormatter.getMinutes(sleepTime) + "m asleep";
            return (
                <View key={currActivity.endTime.toJSON()}>
                    <List.Section>
                        <List.Subheader>{currActivity.date.toDateString()}</List.Subheader>
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
            {activities}
        </ScrollView>
    );
}