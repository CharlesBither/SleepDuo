import { List } from "react-native-paper";
import NapItemSegmentedButton from "../../buttons/NapItemSegmentedButton";
import { HadNapValue } from "@/src/types/HadNapValue";

type NapItemProps = {
    value: HadNapValue;
    setValue: React.Dispatch<React.SetStateAction<HadNapValue>>;
}

export default function NapItem(props: NapItemProps) {
  return (
      <List.Item
        title="Did I take a nap?"
        description={() => <NapItemSegmentedButton value={props.value} setValue={props.setValue} />}
      />
  );
}
