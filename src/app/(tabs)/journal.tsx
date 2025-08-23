import { useTheme, Text, Divider, Button } from 'react-native-paper';
import { useCallback, useState } from 'react';

import ThemedView from '@/src/components/ThemedView';
import { View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';
import { journalRecordsMap } from '@/src/database/journal_records';
import { dateToString, getLocalDate, getTimeZone } from '@/src/utils/dates';
import JournalEntryRead from '../JournalEntryRead';

export default function AboutScreen(): JSX.Element {
  const currDate = (new Date());
  const [date, setDate] = useState(currDate);
  const [record, setRecord] = useState(journalRecordsMap.get(dateToString(currDate)));
  const dayInterval = 1000 * 60 * 60 * 24;

  const theme = useTheme();

  /** Called when the user changes the date */
  const handleDateChange = (date: Date): void => {
    setDate(date);
    setRecord(journalRecordsMap.get(dateToString(date)));
  }

  useFocusEffect(
    useCallback(() => {
      setRecord(journalRecordsMap.get(dateToString(date)));
    }, [])
  )

  return (
    <ThemedView>
      {/* date navigation start */}
      <Divider />
      <View style={styles.row}>
        <View>
          <Ionicons name='arrow-back' 
          color={theme.colors.primary} 
          size={28} 
          style={styles.rowArrow} 
          onPress={() => handleDateChange(new Date(date.getTime() - dayInterval))} />
        </View>

        <View style={styles.row}>
          <Ionicons name='calendar' color={theme.colors.primary} size={24} style={styles.rowArrow} />
          <Text variant='bodyLarge' style={styles.rowDate}>{getLocalDate(date, getTimeZone())}</Text>
        </View>

        <View>
          <Ionicons name='arrow-forward' 
          color={theme.colors.primary} 
          size={28} 
          style={styles.rowArrow}
          onPress={() => handleDateChange(new Date(date.getTime() + dayInterval))} />
        </View>
      </View>
      <Divider />
      {/* date navigation end */}

      {/* Journal content */}
      <JournalEntryRead record={record} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  text: {
    marginLeft: 15,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowArrow: {
    padding: 5,
    marginHorizontal: 5,
  },
  rowDate: {
    paddingVertical: 7,
  }
})