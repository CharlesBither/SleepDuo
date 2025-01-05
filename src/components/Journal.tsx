import React from 'react';
import { View, ScrollView } from 'react-native';
import { Divider, List } from 'react-native-paper';

import { SleepActivity } from "@/src/activities/SleepActivity";
import { Activity } from '@/src/activities/Activity';

type Props = {
    Activity: Activity[], 
};

export default function Journal({ Activity }: Props) {

    const activity = Activity.map((activity) => {
        if (activity instanceof SleepActivity) {
            const sleepDescription: String = activity.getHoursAsleep() + "h " + activity.getMinutesAsleep() + "m asleep";
            return (
                <View key={activity.endTime.toJSON()}>
                    <List.Section>
                        <List.Subheader>{activity.date.toDateString()}</List.Subheader>
                        <List.Item
                            right={(props) => <List.Icon {...props} icon="sleep" />}
                            title="Sleep"
                            description={ sleepDescription }
                        />
                    </List.Section>
                    <Divider />
                </View>
            )  
        }
    });

    return (
        <ScrollView>
            {activity}
        </ScrollView>
    );
}