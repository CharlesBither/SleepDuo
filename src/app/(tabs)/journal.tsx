import { useTheme, Text, Divider, List } from 'react-native-paper';
import { useState } from 'react';

import ThemedView from '@/src/app/components/ThemedView';
import RouteButton from '@/src/app/components/Button/RouteButton';
import { DateFormatter } from '@/src/utils/DateFormatter';
import { View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function AboutScreen() {
  const dateFormatter = new DateFormatter();

  const [date, setDate] = useState(new Date())
  const dayInterval = 1000 * 60 * 60 * 24

  const [journalContent, setJournalContent] = useState(null)
  const theme = useTheme()

  return (
    <ThemedView>
      {/* Date navigation */}
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

      {/* Journal content */}
      {journalContent ? <Text>has content</Text> : <Text>no content</Text>}
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