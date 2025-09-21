import React from "react";
import { View, ScrollView } from "react-native";
import { Divider, List } from "react-native-paper";

import { SleepSession } from "@/src/types/SleepSession";
import { router } from "expo-router";
import {
  getFormattedDate,
  getHours,
  getMinutes,
} from "../../utils/dates";

type Props = {
  recordArray: SleepSession[];
};

/*
 * returns a list of records that will be displayed in '/(tabs)/records'
 */
export default function RecordsList({ recordArray: recordArray }: Props) {
  const handlePress = (guid: string | undefined): void => {
    if (guid) {
      router.push(`/RecordDetailsRead?guid=${guid}`);
    }
  };

  const records = recordArray.map((currRecord) => {
    const sleepTime = currRecord.totalSleepTime;
    const sleepDescription: String =
      getHours(sleepTime) + "h " + getMinutes(sleepTime) + "m asleep";

    return (
      <View key={currRecord.endTime.toJSON()}>
        <List.Section>
          <List.Subheader>
            {getFormattedDate(currRecord.endTime)}
          </List.Subheader>
          <List.Item
            right={(props) => <List.Icon {...props} icon="sleep" />}
            title="Sleep"
            description={sleepDescription}
            onPress={() => handlePress(currRecord.guid)}
          />
        </List.Section>
        <Divider />
      </View>
    );
  });

  return <ScrollView>{records}</ScrollView>;
}
