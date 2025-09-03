import { SleepRecord } from "@/src/types/SleepRecord";
import { getFormattedDate, getHours, getMinutes, getTimeZone } from "@/src/utils/dates";
import { List } from "react-native-paper";

type DuringSleepSectionProps = {
  record: SleepRecord;
}

export default function DuringSleepSection(props: DuringSleepSectionProps) {
  return (
    <List.Section>
      <List.Subheader>During sleep</List.Subheader>
      <List.Item title="Went to sleep at" description={getFormattedDate(props.record.startTime)} />
      <List.Item title="Got out of bed at" description={getFormattedDate(props.record.endTime)} />
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
