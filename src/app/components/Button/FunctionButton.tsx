import { StyleSheet, View } from 'react-native';
import { Href, useRouter } from 'expo-router';
import { useTheme, Button } from 'react-native-paper';
import { GestureResponderEvent } from 'react-native';

type Props = {
  label: string;                            // the text contained in the button
  func: (e: GestureResponderEvent) => void; // the function that is executed onPress
};

export default function FunctionButton({ label, func }: Props) {
  const theme = useTheme()
  return (
    <View style={styles.buttonContainer}>
      <Button
        mode="contained-tonal"
        onPress={func}
      >
        {label}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    margin: 4,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});
