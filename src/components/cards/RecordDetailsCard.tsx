import { Button, Card, List, useTheme, Text } from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";
import { getRecordDetails } from "@/src/database/recordDetails";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { RecordDetails } from "@/src/types/RecordDetails";
import { View } from "react-native";
import RecordDetailsDeleteButton from "../buttons/RecordDetailsDeleteButton";

type RecordDetailsBeforeSleepCardProps = {
  guid: string; // sleep record ID
};

export default function RecordDetailsCard(
  props: RecordDetailsBeforeSleepCardProps
) {

  useFocusEffect(
    useCallback(() => {
      setDetails(getRecordDetails(props.guid));
    }, [])
  );

  const theme = useTheme();
  const [details, setDetails] = useState<RecordDetails | undefined>(
    getRecordDetails(props.guid)
  );

  const handleAddDetailsPress = (): void => {
    router.push(`/RecordDetailsEdit?guid=${props.guid}`);
  };

  if (!details) {
    return (
      <List.Section>
        <List.Subheader>Record Details</List.Subheader>
        <List.Item
          title="No recorded details."
          description="Click the plus icon to add details"
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
    switch (details.alcohol_time) {
      case "NA":
        return "0 drinks consumed";
      case "AM":
        return `${details.alcohol_quantity} drinks consumed in the morning`;
      case "PM":
        return `${details.alcohol_quantity} drinks consumed by the evening`;
      case "LN":
        return `${details.alcohol_quantity} drinks consumed by late at night`;
    }
  }

  const getCaffeineDescription = (): string => {
    switch (details.caffeine_time) {
      case "NA":
        return "0 drinks consumed";
      case "AM":
        return `${details.caffeine_quantity} drinks consumed in the morning`;
      case "PM":
        return `${details.caffeine_quantity} drinks consumed by the evening`;
      case "LN":
        return `${details.caffeine_quantity} drinks consumed by late at night`;
    }
  }
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
            title={details.had_nap === "yes" ? "I took a nap" : "I didn't take a nap"}
          />
        </List.Section>
        <List.Section>
          <List.Subheader>After sleep</List.Subheader>
          <List.Item
            title="Quality of sleep"
            right={() => <Text>{details.quality_of_sleep}</Text>}
          />
        </List.Section>
      </Card.Content>
      <Card.Actions>
        <RecordDetailsDeleteButton guid={props.guid} setDetails={setDetails} />
        <View style={{flex: 1}}></View>
        <Button onPress={() => router.push(`/RecordDetailsEdit?guid=${props.guid}`)}>Edit</Button>
      </Card.Actions>
    </Card>
  );
}
