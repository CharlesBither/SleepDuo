import { List } from 'react-native-paper';
import QualityOfSleepSegmentedButton from '../../buttons/QualityOfSleepSegmentedButton';
import { QualityOfSleep } from '@/src/types/QualityOfSleep';

type AfterSleepSectionProps = {
  quality: QualityOfSleep;
  setQuality: React.Dispatch<React.SetStateAction<QualityOfSleep>>;
};

export default function AfterSleepSection(props: AfterSleepSectionProps) {
  return (
    <List.Section>
      <List.Subheader>After sleep</List.Subheader>
      <List.Item
        title="Quality of sleep (1: not restful, 5: very restful)"
        description={() => (
          <QualityOfSleepSegmentedButton
            quality={props.quality}
            setQuality={props.setQuality}
          />
        )}
      />
    </List.Section>
  );
}
