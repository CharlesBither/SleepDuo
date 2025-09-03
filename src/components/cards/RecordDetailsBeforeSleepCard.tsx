import { Button, Card, List, useTheme } from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";
import { getRecordDetails } from "@/src/database/recordDetails";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { RecordDetails } from "@/src/types/RecordDetails";
import { View } from "react-native";
import RecordDetailsDeleteButton from "../buttons/RecordDetailsDeleteButton";
import { getFormattedDate } from "@/src/utils/dates";

type RecordDetailsBeforeSleepCardProps = {
  guid: string; // sleep record ID
};

export default function RecordDetailsBeforeSleepCard(
  props: RecordDetailsBeforeSleepCardProps
) {
  const theme = useTheme();
  const [details, setDetails] = useState<RecordDetails | undefined>(
    getRecordDetails(props.guid)
  );

  const handleAddDetailsPress = (): void => {
    router.push(`/RecordDetailsEditBeforeSleep?guid=${props.guid}`);
  };

  useFocusEffect(
    useCallback(() => {
      setDetails(getRecordDetails(props.guid));
    }, [])
  );

  if (!details) {
    return (
      <List.Section>
        <List.Subheader>Before sleep</List.Subheader>
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

  const alcoholDescription =
    details.alcohol_quantity === "0" || !details.alcohol_date
      ? `0 drinks consumed`
      : `${details.alcohol_quantity} drinks consumed by ${getFormattedDate(details.alcohol_date)}`;

  const caffieneDescription =
    details.caffiene_quantity === "0" || !details.caffiene_date
      ? `0 drinks consumed`
      : `${details.caffiene_quantity} drinks consumed by ${getFormattedDate(details.caffiene_date)}`;

  return (
    <Card>
      <Card.Content>
        <List.Section>
          <List.Subheader>Before sleep</List.Subheader>
          <List.Item
            title="Caffinated drinks"
            description={caffieneDescription}
          />
          <List.Item
            title="Alcoholic drinks"
            description={alcoholDescription}
          />
        </List.Section>
      </Card.Content>
      <Card.Actions>
        <RecordDetailsDeleteButton guid={props.guid} setDetails={setDetails} />
        <View style={{flex: 1}}></View>
        <Button onPress={() => router.push(`/RecordDetailsEditBeforeSleep?guid=${props.guid}`)}>Edit</Button>
      </Card.Actions>
    </Card>
  );
}
