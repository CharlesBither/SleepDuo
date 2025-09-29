import { List } from 'react-native-paper';
import Quantity from '../../textInputs/Quantity';
import TimeOfDaySegmentedButton from '../../buttons/TimeOfDaySegmentedButton';
import { TimeOfDay } from '@/src/types/TimeOfDay';

type CaffeineItemProps = {
  caffeineQuantity: string;
  setCaffeineQuantity: (quantity: string) => void;
  caffeineTime: TimeOfDay;
  setCaffeineTime: React.Dispatch<React.SetStateAction<TimeOfDay>>;
};

export default function CaffeineItem(props: CaffeineItemProps) {
  if (
    props.caffeineQuantity === '0' ||
    props.caffeineQuantity === '' ||
    props.caffeineQuantity === '00'
  ) {
    return (
      <>
        <List.Item
          title="Drinks containing caffeine"
          right={() => (
            <Quantity
              quantity={props.caffeineQuantity}
              setQuantityFunc={props.setCaffeineQuantity}
              setTime={props.setCaffeineTime}
            />
          )}
        />
        <List.Item
          title="When did I have my last drink"
          description={() => (
            <TimeOfDaySegmentedButton
              timeOfDay={props.caffeineTime}
              setTimeOfDay={props.setCaffeineTime}
              disabled={true}
            />
          )}
        />
      </>
    );
  }
  return (
    <>
      <List.Item
        title="Drinks containing caffeine"
        right={() => (
          <Quantity
            quantity={props.caffeineQuantity}
            setQuantityFunc={props.setCaffeineQuantity}
            setTime={props.setCaffeineTime}
          />
        )}
      />
      <List.Item
        title="When did I have my last drink"
        description={() => (
          <TimeOfDaySegmentedButton
            timeOfDay={props.caffeineTime}
            setTimeOfDay={props.setCaffeineTime}
            disabled={false}
          />
        )}
      />
    </>
  );
}
