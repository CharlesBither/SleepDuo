import React from 'react';
import { View, ScrollView } from 'react-native';
import { Divider, List } from 'react-native-paper';

import { SleepActivity } from "@/src/activities/SleepActivity";
import { Activity } from '@/src/activities/Activity';
import { DateFormatter } from '../../utils/DateFormatter';

type Props = {
    activityArray: Activity[],
};

export default function Journal({ activityArray }: Props) {

    const activities = activityArray.map((currActivity) => {
        if (currActivity instanceof SleepActivity) {
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