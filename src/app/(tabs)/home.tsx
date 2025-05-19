import { useState } from "react";
import { List } from "react-native-paper";

import startHealthConnect from "@/src/health-connect/initialize";
import { getLast14Days } from "@/src/health-connect/sleep-data";
import { SleepRecord } from "@/src/records/SleepRecord";
import { SleepDuoRecord } from "@/src/records/SleepDuoRecord";
import { DateFormatter } from "@/src/utils/DateFormatter";
import ThemedView from "@/src/app/components/ThemedView";
import { ReadRecordsResult } from "react-native-health-connect";

/**
 * This component is shown after the user is authenticated.
 * Connects to the health-connect api and gets sleep data from the
 * last 14 days.
 *
 * @returns View containing average total sleep time and efficiency
 */
export default function Home() {
  const [sleepArray, setSleepArray] = useState<SleepDuoRecord[]>([]);

  // get required permissions from health-connect
  startHealthConnect()
    .then(() => getSleepRecords())
    .catch(() => console.log("could not initialize health-connect"));

  // get ReadRecordsResult<"SleepSession"> from last 14 days
  const getSleepRecords = (): void => {
    getLast14Days()
      .then((data) => initSleepArray(data))
      .catch(() => console.log("could not get sleep data"));
  };

  // @param data: ReadRecordsResult<"SleepSession"> containing 14 days of sleep data.
  // creates a list of SleepRecords and assigns to sleepArray.
  const initSleepArray = (data: ReadRecordsResult<"SleepSession">): void => {
    let arr: SleepDuoRecord[] = [];
    const records = data.records;
    for (let i = 0; i < records.length; i++) {
      const currSleepActivity = new SleepRecord(records[i]);
      arr.push(currSleepActivity);
    }

    if (arr.length != sleepArray.length && arr.length !== 0) {
      setSleepArray(arr);
    }
  };

  // average total sleep time over the last 14 days
  const currAverageTST = SleepRecord.getAverageTST(sleepArray);
  const averageTSTDescription =
    DateFormatter.getHours(currAverageTST) +
    "h " +
    DateFormatter.getMinutes(currAverageTST) +
    "m";

  return (
    <ThemedView>
      <List.Section>
        <List.Subheader>Last 14 days</List.Subheader>
        <List.Item
          title="Total Sleep Time"
          description={averageTSTDescription}
        />
      </List.Section>
    </ThemedView>
  );
}
