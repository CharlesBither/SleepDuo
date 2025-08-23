import { List, useTheme } from "react-native-paper";
import { RecordDetails } from "@/src/types/RecordDetails";
import AntDesign from '@expo/vector-icons/AntDesign';

type BeforeSleepReadSectionProps = {
  details: RecordDetails | undefined;
};

export default function BeforeSleepReadSection(
  props: BeforeSleepReadSectionProps
) {
  const theme = useTheme();

  const handleAddDetailsPress = (): void => {
    
  }

  if (!props.details) {
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
    props.details.alcohol_quantity === "0"
      ? `0 drinks consumed`
      : `${props.details.alcohol_quantity} drinks consumed by ${props.details.alcohol_date}`;

  const caffieneDescription =
    props.details.caffiene_quantity === "0"
      ? `0 drinks consumed`
      : `${props.details.caffiene_quantity} drinks consumed by ${props.details.caffiene_date}`;

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
