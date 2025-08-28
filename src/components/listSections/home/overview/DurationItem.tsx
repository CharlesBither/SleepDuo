import { ActivityIndicator, List, Text } from "react-native-paper";
import { getHours, getMinutes } from "@/src/utils/dates";
import { OverviewDetails } from "@/src/types/OverviewDetails";

type DurationItemProps = {
  last7Details: OverviewDetails | undefined;
  last30Details?: OverviewDetails;
  allTimeDetails?: OverviewDetails;
  interval: string;
};

export default function DurationItem(props: DurationItemProps) {
  if (
    !(props.last7Details &&
    props.last30Details &&
    props.allTimeDetails)
  ) {
    return <ActivityIndicator />;
  }

  let details = props.last7Details;
  if (props.interval === '30') details = props.last30Details;
  else if (props.interval === 'All time') details = props.allTimeDetails;

  return (
    <List.Section>
        <List.Subheader>Duration</List.Subheader>
        <List.Item
          title="Asleep"
          right={() => <Text>{getHours(details.totalSleepTime)}h {getMinutes(details.totalSleepTime)}m</Text>}
          description="Average time spent asleep"
        />
        <List.Item 
          title="In bed"
          right={() => <Text>{getHours(details.timeInBed)}h {getMinutes(details.timeInBed)}m</Text>}
          description="Average time spent in bed"
        />
        <List.Item 
          title="Efficiency"
          right={() => <Text>{details.sleepEfficiency}%</Text>}
          description="Average time in bed spent asleep"
        />
      </List.Section>
  );
}
