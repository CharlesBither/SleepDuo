import { SleepSessionAvgData } from '@/src/types/SleepSessionAvgData';
import { getHours, getMinutes } from '@/src/utils/dates';
import { StyleSheet } from 'react-native';
import { Card, List, Text } from 'react-native-paper';

type SleepSessionAvgDataSectionProps = {
  data?: SleepSessionAvgData;
};

export default function SleepSessionAvgDataSection(
  props: SleepSessionAvgDataSectionProps
) {
  const data = props.data;
  if (!data) return <></>;
  if (data.totalSleepTime === 0) {
    return (
      <Card style={{ ...styles.card }}>
        <Card.Content>
          <Text variant="titleMedium" style={{ ...styles.cardTitle }}>
            Not enough recorded logs
          </Text>
          <Text variant="bodyMedium" style={{ ...styles.cardContent }}>
            Create additional logs in the 'Sessions' tab to view this data.
          </Text>
        </Card.Content>
      </Card>
    );
  }
  return (
    <>
      <List.Section>
        <List.Subheader>Duration</List.Subheader>
        <List.Item
          title="Asleep"
          right={() => (
            <Text>
              {getHours(data.totalSleepTime)}h {getMinutes(data.totalSleepTime)}
              m
            </Text>
          )}
          description="Average time spent asleep"
          contentStyle={styles.listItem}
        />
        <List.Item
          title="In bed"
          right={() => (
            <Text>
              {getHours(data.timeInBed)}h {getMinutes(data.timeInBed)}m
            </Text>
          )}
          description="Average time spent in bed"
          contentStyle={styles.listItem}
        />
        <List.Item
          title="Efficiency"
          right={() => <Text>{data.sleepEfficiency}%</Text>}
          description="Average time in bed spent asleep"
          contentStyle={styles.listItem}
        />
      </List.Section>
      <List.Section style={styles.listSection}>
        <List.Subheader>Sleep stages</List.Subheader>
        <List.Item
          title="Light sleep"
          right={() => (
            <Text>
              {getHours(data.timeLightSleep)}h {getMinutes(data.timeLightSleep)}
              m
            </Text>
          )}
          description="Average time in light sleep"
          contentStyle={styles.listItem}
        />
        <List.Item
          title="Deep sleep"
          right={() => (
            <Text>
              {getHours(data.timeDeepSleep)}h {getMinutes(data.timeDeepSleep)}m
            </Text>
          )}
          description="Average time in deep sleep"
          contentStyle={styles.listItem}
        />
        <List.Item
          title="REM sleep"
          right={() => (
            <Text>
              {getHours(data.timeRemSleep)}h {getMinutes(data.timeRemSleep)}m
            </Text>
          )}
          description="Average time in REM sleep"
          contentStyle={styles.listItem}
        />
      </List.Section>
    </>
  );
}

const styles = StyleSheet.create({
  listItem: {
    marginVertical: -5,
  },
  listSection: {
    marginTop: -5,
  },
  text: {
    marginHorizontal: 15,
  },
  cardContent: {
    marginTop: 10,
  },
  cardTitle: {
    fontWeight: 600,
  },
  card: {
    margin: 20,
  },
});
