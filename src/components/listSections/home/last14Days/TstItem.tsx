import { getHours, getMinutes } from "@/src/utils/dates";
import { ActivityIndicator, List } from "react-native-paper";

type TstItemProps = {
    averageTst: number;
}

export default function TstItem(props: TstItemProps) {
    if (props.averageTst === -1) {
        return <List.Item title="Total Sleep Time" description={<ActivityIndicator />} />
    }
    return (
        <List.Item title="Total Sleep Time" description={`${getHours(props.averageTst)}h ${getMinutes(props.averageTst)}m`} />
    )
}