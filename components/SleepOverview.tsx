import React from 'react';
import { Text, View, type TextProps, StyleSheet } from 'react-native';
import { useState } from "react";

import initializeHealthConnect from "@/health-connect/initialize";
import { getSleepData } from "@/health-connect/sleep-data";
import { SleepRecordInfo } from "@/health-connect/SleepRecordInfo";

type Props = {
    sleepRecordInfo: SleepRecordInfo[], 
};

export default function SleepOverview({ sleepRecordInfo }: Props) {

    const records = sleepRecordInfo.map(record => 
        <View key={record._record.endTime} style={styles.container}>
            <Text style={styles.text}>Time in bed : { record.timeInBed } ms</Text>
            <Text style={styles.text}>Total sleep time : { record.totalSleepTime } ms</Text>
            <Text style={styles.text}>Sleep efficiency : { record.sleepEfficiency } %</Text>
        </View>
    )

    return (
        <View>
            {records}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#25292e',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: '#fff',
    },
  });