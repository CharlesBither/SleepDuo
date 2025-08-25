import { SleepRecord } from "@/src/records/SleepRecord";
import { getHours, getMinutes } from "@/src/utils/dates";
import { List } from "react-native-paper";

type DuringSleepSectionProps = {
  record: SleepRecord;
}

export default function DuringSleepSection(props: DuringSleepSectionProps) {
  return (
    <List.Section>
      <List.Subheader>During sleep</List.Subheader>
      <List.Item title="Went to sleep at" description={props.record.startTime.toString()} />
      <List.Item title="Got out of bed at" description={props.record.endTime.toString()} />
      <List.Item
        title="Duration"
        description={`${getHours(props.record.totalSleepTime)}h ${getMinutes(
          props.record.totalSleepTime
        )}m asleep`}
      />
      <List.Item
        title="Sleep efficiency"
        description={`${props.record.sleepEfficiency}% (time in bed / time asleep)`}
      />
    </List.Section>
  );
}
