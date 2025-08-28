import { ActivityIndicator, List, Text } from "react-native-paper";
import { getHours, getMinutes } from "@/src/utils/dates";

type DurationItemProps = {
  last7DaysTst: number;
  last30DaysTst: number;
  allTimeTst: number;
};

export default function DurationItem(props: DurationItemProps) {
  if (
    props.last7DaysTst === -1 ||
    props.last30DaysTst === -1 ||
    props.allTimeTst === -1
  ) {
    return <ActivityIndicator />;
  }

  return (
    <List.Section>
      <List.Subheader>Duration</List.Subheader>
      <List.Item
        title="Last 7 days"
        description={
          <Text>
            {getHours(props.last7DaysTst)}h {getMinutes(props.last7DaysTst)}m
          </Text>
        }
      />
      <List.Item
        title="Last 30 days"
        description={
          <Text>
            {getHours(props.last30DaysTst)}h {getMinutes(props.last30DaysTst)}m
          </Text>
        }
      />
      <List.Item
        title="All time"
        description={
          <Text>
            {getHours(props.allTimeTst)}h {getMinutes(props.allTimeTst)}m
          </Text>
        }
      />
    </List.Section>
  );
}
