import { List } from "react-native-paper";
import NapItemSegmentedButton from "../../buttons/NapItemSegmentedButton";
import { BooleanFilter } from "@/src/types/BooleanFilter";

type NapItemProps = {
    value: BooleanFilter;
    setValue: React.Dispatch<React.SetStateAction<BooleanFilter>>;
}

export default function NapItem(props: NapItemProps) {
  return (
      <List.Item
        title="Did I take a nap?"
        description={() => <NapItemSegmentedButton value={props.value} setValue={props.setValue} />}
      />
  );
}
