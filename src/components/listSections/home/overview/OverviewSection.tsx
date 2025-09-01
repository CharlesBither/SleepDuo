import { ActivityIndicator, Divider, List, Text } from "react-native-paper";
import { getHours, getMinutes } from "@/src/utils/dates";
import { OverviewDetails } from "@/src/types/OverviewDetails";
import { StyleSheet } from "react-native";
import ExploreDataSection from "../../ExploreDataSection";

type DurationItemProps = {
  last7Details: OverviewDetails | undefined;
  last30Details?: OverviewDetails;
  allTimeDetails?: OverviewDetails;
  interval: string;
};

export default function OverviewSection(props: DurationItemProps) {
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

  return <ExploreDataSection details={details} />
}

const styles = StyleSheet.create({
  listItem: {
    marginVertical: -5,
  },
  divider: {
    marginBottom: -5,
  }
})