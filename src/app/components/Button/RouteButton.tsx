import { StyleSheet, View } from 'react-native';
import { Href, useRouter } from 'expo-router';
import { useTheme, Button } from 'react-native-paper';

type Props = {
  label: string;
  path: string;
};

export default function RouteButton({ label, path }: Props) {
  const router = useRouter()
  const theme = useTheme()
  return (
    <View style={styles.buttonContainer}>
      <Button
        mode="contained-tonal"
        onPress={() => router.push(path as Href)}
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
