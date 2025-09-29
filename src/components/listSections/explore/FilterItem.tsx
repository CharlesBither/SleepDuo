import { BooleanFilter } from '@/src/types/BooleanFilter';
import { SleepSessionActivity } from '@/src/types/SleepSessionActivity';
import { TimeOfDay } from '@/src/types/TimeOfDay';
import { Button, List } from 'react-native-paper';

type FilterItemProps = {
  activity: SleepSessionActivity | '';
  napFilter: BooleanFilter | '';
  timeOfDayFilter: TimeOfDay[];
  onFilterChangeButtonPress: () => void;
};

export default function FilterItem(props: FilterItemProps) {
  const getSelectedFilters = (): string => {
    if (props.activity === 'nap') {
      return props.napFilter === '' ? 'None' : props.napFilter;
    }
    if (!props.timeOfDayFilter || props.timeOfDayFilter.length === 0) {
      return 'None';
    }
    let filters = props.timeOfDayFilter[0];
    for (let i = 1; i < props.timeOfDayFilter.length; i++) {
      filters += `, ${props.timeOfDayFilter[i]}`;
    }
    return filters;
  };

  if (props.activity === '') {
    return (
      <List.Item
        title={`Filter: None`}
        description="Click the button to change the filter"
        right={() => <Button disabled={true}>Change filter</Button>}
        disabled={true}
      />
    );
  }
  return (
    <List.Item
      title={`Filter: ${getSelectedFilters()}`}
      description="Click the button to change the filter"
      right={() => (
        <Button onPress={props.onFilterChangeButtonPress}>Change filter</Button>
      )}
      disabled={true}
    />
  );
}
