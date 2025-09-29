import { List } from 'react-native-paper';
import Quantity from '../../textInputs/Quantity';
import { TimeOfDay } from '@/src/types/TimeOfDay';
import TimeOfDaySegmentedButton from '../../buttons/TimeOfDaySegmentedButton';

type AlcoholItemProps = {
  alcoholQuantity: string;
  alcoholTime: TimeOfDay;
  setAlcoholQuantity: (quantity: string) => void;
  setAlcoholTime: React.Dispatch<React.SetStateAction<TimeOfDay>>;
};

export default function AlcoholItem(props: AlcoholItemProps) {
  if (
    props.alcoholQuantity === '0' ||
    props.alcoholQuantity === '' ||
    props.alcoholQuantity === '00'
  ) {
    return (
      <>
        <List.Item
          title="Drinks containing alcohol"
          right={() => (
            <Quantity
              quantity={props.alcoholQuantity}
              setQuantityFunc={props.setAlcoholQuantity}
              setTime={props.setAlcoholTime}
            />
          )}
        />
        <List.Item
          title="When did I have my last drink"
          description={() => (
            <TimeOfDaySegmentedButton
              timeOfDay={props.alcoholTime}
              setTimeOfDay={props.setAlcoholTime}
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
        title="Drinks containing alcohol"
        right={() => (
          <Quantity
            quantity={props.alcoholQuantity}
            setQuantityFunc={props.setAlcoholQuantity}
            setTime={props.setAlcoholTime}
          />
        )}
      />
      <List.Item
        title="When did I have my last drink"
        description={() => (
          <TimeOfDaySegmentedButton
            timeOfDay={props.alcoholTime}
            setTimeOfDay={props.setAlcoholTime}
            disabled={false}
          />
        )}
      />
    </>
  );
}
