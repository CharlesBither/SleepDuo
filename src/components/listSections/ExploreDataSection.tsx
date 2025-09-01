import { OverviewDetails } from "@/src/types/OverviewDetails";
import { getHours, getMinutes } from "@/src/utils/dates";
import { StyleSheet } from "react-native";
import { ActivityIndicator, Divider, List, Text } from "react-native-paper";

type ExploreDataSectionProps = {
    details?: OverviewDetails;
}

export default function ExploreDataSection({ details }: ExploreDataSectionProps) {
    if (!details) {
        return <ActivityIndicator />
    } 
    else if (details.totalSleepTime === 0) {
        return (
            <Text>Not enough recorded logs. Create additional logs to view this data.</Text>
        )
    }
    return (
        <>
            <List.Section>
                <List.Subheader>Duration</List.Subheader>
                <List.Item
                    title="Asleep"
                    right={() => <Text>{getHours(details.totalSleepTime)}h {getMinutes(details.totalSleepTime)}m</Text>}
                    description="Average time spent asleep"
                    contentStyle={styles.listItem}
                />
                <List.Item
                    title="In bed"
                    right={() => <Text>{getHours(details.timeInBed)}h {getMinutes(details.timeInBed)}m</Text>}
                    description="Average time spent in bed"
                    contentStyle={styles.listItem}
                />
                <List.Item
                    title="Efficiency"
                    right={() => <Text>{details.sleepEfficiency}%</Text>}
                    description="Average time in bed spent asleep"
                    contentStyle={styles.listItem}
                />
            </List.Section>
            <Divider style={styles.divider} />
            <List.Section>
                <List.Subheader>Sleep stages</List.Subheader>
                <List.Item
                    title="Light sleep"
                    right={() => <Text>{getHours(details.timeLightSleep)}h {getMinutes(details.timeLightSleep)}m</Text>}
                    description="Average time in light sleep"
                    contentStyle={styles.listItem}
                />
                <List.Item
                    title="Deep sleep"
                    right={() => <Text>{getHours(details.timeDeepSleep)}h {getMinutes(details.timeDeepSleep)}m</Text>}
                    description="Average time in deep sleep"
                    contentStyle={styles.listItem}
                />
                <List.Item
                    title="REM sleep"
                    right={() => <Text>{getHours(details.timeRemSleep)}h {getMinutes(details.timeRemSleep)}m</Text>}
                    description="Average time in REM sleep"
                    contentStyle={styles.listItem}
                />
            </List.Section>
        </>

    );
}

const styles = StyleSheet.create({
  listItem: {
    marginVertical: -5,
  },
  divider: {
    marginBottom: -5,
  }
})