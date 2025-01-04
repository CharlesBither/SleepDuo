import React from 'react';
import { Text, View, type TextProps, StyleSheet, ScrollView } from 'react-native';
import { Divider, List, MD3Colors } from 'react-native-paper';

import { SleepActivity } from "@/activities/SleepActivity";
import { Activity } from '@/activities/Activity';

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