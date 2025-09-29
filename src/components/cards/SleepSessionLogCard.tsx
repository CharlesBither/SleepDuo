import { Button, Card, List, useTheme, Text } from 'react-native-paper';
import AntDesign from '@expo/vector-icons/AntDesign';
import { getSleepSessionLog } from '@/src/database/sleepSessionLogs';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { SleepSessionLog } from '@/src/types/SleepSessionLog';
import { View } from 'react-native';
import SleepSessionLogDeleteButton from '../buttons/SleepSessionLogDeleteButton';

type SleepSessionLogCardProps = {
  guid: string; // sleep session ID
};

export default function SleepSessionLogCard(props: SleepSessionLogCardProps) {
  useFocusEffect(
    useCallback(() => {
      setSleepSessionLog(getSleepSessionLog(props.guid));
    }, [props.guid])
  );

  const theme = useTheme();
  const [sleepSessionLog, setSleepSessionLog] = useState<
    SleepSessionLog | undefined
  >(getSleepSessionLog(props.guid));

  const handleAddDetailsPress = (): void => {
    router.push(`/SleepSessionLogEdit?guid=${props.guid}`);
  };

  if (!sleepSessionLog) {
    return (
      <List.Section>
        <List.Subheader>Sleep Session Log</List.Subheader>
        <List.Item
          title="No log recorded."
          description="Click the plus icon to add a log"
          right={() => (
            <AntDesign
              name="pluscircle"
              size={24}
              color={theme.colors.primary}
              onPress={handleAddDetailsPress}
            />
          )}
        />
      </List.Section>
    );
  }

  const getAlcoholDescription = (): string => {
    switch (sleepSessionLog.alcohol_time) {
      case 'NA':
        return '0 drinks consumed';
      case 'AM':
        return `${sleepSessionLog.alcohol_quantity} drinks consumed in the morning`;
      case 'PM':
        return `${sleepSessionLog.alcohol_quantity} drinks consumed by the evening`;
      case 'LN':
        return `${sleepSessionLog.alcohol_quantity} drinks consumed by late at night`;
    }
  };

  const getCaffeineDescription = (): string => {
    switch (sleepSessionLog.caffeine_time) {
      case 'NA':
        return '0 drinks consumed';
      case 'AM':
        return `${sleepSessionLog.caffeine_quantity} drinks consumed in the morning`;
      case 'PM':
        return `${sleepSessionLog.caffeine_quantity} drinks consumed by the evening`;
      case 'LN':
        return `${sleepSessionLog.caffeine_quantity} drinks consumed by late at night`;
    }
  };
  return (
    <Card>
      <Card.Content>
        <List.Section>
          <List.Subheader>Before sleep</List.Subheader>
          <List.Item
            title="Drinks containing caffeine"
            description={getCaffeineDescription()}
          />
          <List.Item
            title="Drinks containing alcohol"
            description={getAlcoholDescription()}
          />
          <List.Item
            title={
              sleepSessionLog.had_nap === 'yes'
                ? 'I took a nap'
                : "I didn't take a nap"
            }
          />
        </List.Section>
        <List.Section>
          <List.Subheader>After sleep</List.Subheader>
          <List.Item
            title="Quality of sleep"
            right={() => <Text>{sleepSessionLog.quality_of_sleep}</Text>}
          />
        </List.Section>
      </Card.Content>
      <Card.Actions>
        <SleepSessionLogDeleteButton
          guid={props.guid}
          setLog={setSleepSessionLog}
        />
        <View style={{ flex: 1 }}></View>
        <Button
          onPress={() => router.push(`/SleepSessionLogEdit?guid=${props.guid}`)}
        >
          Edit
        </Button>
      </Card.Actions>
    </Card>
  );
}
