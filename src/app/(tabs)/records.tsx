import { useState } from "react";
import { Text } from "react-native-paper";

import { SleepDuoRecord } from "@/src/records/SleepDuoRecord";
import startHealthConnect from "@/src/health-connect/initialize";
import { getLast14Days } from "@/src/health-connect/sleep-data";
import { SleepRecord } from "@/src/records/SleepRecord";
import RecordsList from "@/src/app/components/RecordsList";
import ThemedView from "@/src/app/components/ThemedView";
import { ReadRecordsResult } from "react-native-health-connect";

/**
 * Gets the last 14 days of sleep records and renders it's information
 * for the user as a list.
 *
 * @returns View containing a list of sleep records and their descriptions
 */
export default function RecordsScreen() {
  const [recordsArray, setRecordsArray] = useState<SleepDuoRecord[]>([]);

  // get required permissions from health-connect and cal getSleepData
  startHealthConnect()
    .then(() => getSleepData())
    .catch(() => console.log("could not initialize hc"));

  // get ReadRecordsResult<"SleepSession"> from last 14 days
  // and call initializeRecordsArray
  const getSleepData = (): void => {
    getLast14Days()
      .then((data) => initializeRecordsArray(data))
      .catch(() => console.log("could not get sleep data"));
  };

  // initializes the recordsArray to a list of SleepRecords
  // param data: the ReadRecordsResult that will be used to create the list
  const initializeRecordsArray = (data: ReadRecordsResult<"SleepSession">): void => {
    let arr: SleepDuoRecord[] = [];

    const records = data.records;
    for (let i = 0; i < records.length; i++) {
      const currSleepActivity = new SleepRecord(records[i]);
      arr.push(currSleepActivity);
    }

    if (arr.length != recordsArray.length) {
      setRecordsArray(arr);
    }
  };

  if (recordsArray) {
    return (
      <ThemedView>
        <RecordsList recordArray={recordsArray} />
      </ThemedView>
    );
  }

  return (
    <ThemedView>
      <Text>empty arr</Text>
    </ThemedView>
  );
}
