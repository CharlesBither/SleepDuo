import { useTheme, Text, Divider } from 'react-native-paper';
import { useState } from 'react';

import ThemedView from '@/src/app/components/ThemedView';
import FunctionButton from '../components/Button/FunctionButton';
import { DateFormatter } from '@/src/utils/DateFormatter';
import { View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { printId } from '@/src/lib/supabase';
import { useRouter } from 'expo-router';

export default function AboutScreen(): JSX.Element {
  const dateFormatter = new DateFormatter();

  const currDate = (new Date());
  // currDate.setHours(0,0,0,0);
  const [date, setDate] = useState(currDate);
  const dayInterval = 1000 * 60 * 60 * 24;

  const [journalContent, setJournalContent] = useState(null);
  const theme = useTheme();
  const router = useRouter();

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
          onPress={() => setDate(new Date(date.getTime() - dayInterval))} />
        </View>

        <View style={styles.row}>
          <Ionicons name='calendar' color={theme.colors.primary} size={24} style={styles.rowArrow} />
          <Text variant='bodyLarge' style={styles.rowDate}>{DateFormatter.getLocalDate(date, dateFormatter.getTimeZone())}</Text>
        </View>

        <View>
          <Ionicons name='arrow-forward' 
          color={theme.colors.primary} 
          size={28} 
          style={styles.rowArrow}
          onPress={() => setDate(new Date(date.getTime() + dayInterval))} />
        </View>
      </View>
      <Divider />
      {/* date navigation end */}

      {/* Journal content */}
      {journalContent ? <Text>has content</Text> : <Text>no content</Text>}
      <FunctionButton label='add entry' func={() => router.push({pathname: '/components/pages/JournalEntryEdit', params: {date: date.toJSON()}})} />
      <FunctionButton label='Test SELECT' func={() => printId()} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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