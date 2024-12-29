import React from 'react';
import { Text, type TextProps, StyleSheet } from 'react-native';
import {
    initialize,
    requestPermission,
    readRecords,
  } from 'react-native-health-connect';

type Props = {
    sleepData?: String, 
};

export default function SleepOverview({ sleepData }: Props) {
    if (sleepData) {
        return (
            <>
                <Text style={styles.text}>Sleep Overview</Text>
                <Text style={styles.text}>{sleepData}</Text>
            </>
        );
    }
    return (
        <>
            <Text style={styles.text}>Sleep Overview</Text>
        </>
        
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