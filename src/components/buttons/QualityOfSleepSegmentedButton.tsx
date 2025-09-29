import { QualityOfSleep } from '@/src/types/QualityOfSleep';
import { StyleSheet, View } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';

type QualityOfSleepSegmentedButtonProps = {
  quality: QualityOfSleep;
  setQuality: React.Dispatch<React.SetStateAction<QualityOfSleep>>;
};

export default function QualityOfSleepSegmentedButton(
  props: QualityOfSleepSegmentedButtonProps
) {
  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={props.quality}
        onValueChange={props.setQuality}
        buttons={[
          {
            value: '1',
            label: '1',
          },
          {
            value: '2',
            label: '2',
          },
          {
            value: '3',
            label: '3',
          },
          {
            value: '4',
            label: '4',
          },
          {
            value: '5',
            label: '5',
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 15,
    alignItems: 'center',
  },
});
