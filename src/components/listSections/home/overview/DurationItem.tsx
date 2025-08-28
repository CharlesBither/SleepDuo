import { ActivityIndicator, List, Text } from "react-native-paper";
import { getHours, getMinutes } from "@/src/utils/dates";
import { View } from "react-native";

type DurationItemProps = {
  last14DaysTst: number;
  last30DaysTst: number;
  allTimeTst: number;
};

export default function DurationItem(props: DurationItemProps) {
  if (
    props.last14DaysTst === -1 ||
    props.last30DaysTst === -1 ||
    props.allTimeTst === -1
  ) {
    return <ActivityIndicator />;
  }
  // return (
  //   <List.Item
  //     title="Duration"
  //     description={
  //       <View>
  //         <Text>
  //           {getHours(props.last14DaysTst)}h {getMinutes(props.last14DaysTst)}m
  //           last 14 days
  //         </Text>
  //         <Text>
  //           {getHours(props.last30DaysTst)}h {getMinutes(props.last30DaysTst)}m
  //           last 30 days
  //         </Text>
  //         <Text>
  //           {getHours(props.allTimeTst)}h {getMinutes(props.allTimeTst)}m all
  //           time
  //         </Text>
  //       </View>
  //     }
  //   />
  // );
  return (
    <List.Section>
      <List.Subheader>Duration</List.Subheader>
      <List.Item
        title="Last 14 days"
        description={
          <Text>
            {getHours(props.last14DaysTst)}h {getMinutes(props.last14DaysTst)}m
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
