import React from 'react';
import { Text, View, type TextProps, StyleSheet, ScrollView } from 'react-native';
import { Divider, List, MD3Colors } from 'react-native-paper';

import { SleepActivity } from "@/activities/SleepActivity";

type Props = {
    SleepActivity: SleepActivity[], 
};

export default function SleepOverview({ SleepActivity }: Props) {

    const records = SleepActivity.map((record) => {
        const sleepDescription: String = record.getHoursAsleep() + "h " + record.getMinutesAsleep() + "m asleep";
        return (
            <View key={record.endTime.toJSON()}>
                <List.Section>
                    <List.Subheader>{record.date.toDateString()}</List.Subheader>
                    <List.Item
                        right={(props) => <List.Icon {...props} icon="sleep" />}
                        title="Sleep"
                        description={ sleepDescription }
                    />
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