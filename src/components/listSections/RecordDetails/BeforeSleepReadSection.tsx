import { List, useTheme } from "react-native-paper";
import AntDesign from '@expo/vector-icons/AntDesign';
import { getRecordDetails } from "@/src/database/recordDetails";
import { router } from "expo-router";

type BeforeSleepReadSectionProps = {
  guid: string; // sleep record ID
};

export default function BeforeSleepReadSection(
  props: BeforeSleepReadSectionProps
) {
  const theme = useTheme();
  const details = getRecordDetails(props.guid);

  const handleAddDetailsPress = (): void => {
    router.push(`/RecordDetailsEditBeforeSleep?guid=${props.guid}`)
  }

  if (!details) {
    return (
      <List.Section>
        <List.Subheader>Before sleep</List.Subheader>
        <List.Item
          title="No recorded details."
          description="Click the plus icon to add details"
          right={() => <AntDesign name="pluscircle" size={24} color={theme.colors.primary} onPress={handleAddDetailsPress} />}
        />
      </List.Section>
    );
  }

  const alcoholDescription =
    details.alcohol_quantity === "0"
      ? `0 drinks consumed`
      : `${details.alcohol_quantity} drinks consumed by ${details.alcohol_date}`;

  const caffieneDescription =
    details.caffiene_quantity === "0"
      ? `0 drinks consumed`
      : `${details.caffiene_quantity} drinks consumed by ${details.caffiene_date}`;

  return (
    <List.Section>
      <List.Subheader>Before sleep</List.Subheader>
      <List.Item
        title="Alcoholic drinks"
        description={alcoholDescription}
      />
      <List.Item
        title="Caffinated drinks"
        description={caffieneDescription}
      />
    </List.Section>
  );
}
