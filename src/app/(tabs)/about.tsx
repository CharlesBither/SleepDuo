import { useTheme, Text } from 'react-native-paper';

import ThemedView from '@/src/app/components/ThemedView';
import RouteButton from '@/src/app/components/Button/RouteButton';

export default function AboutScreen() {
  const theme = useTheme();
  return (
    <ThemedView>
      <Text>About screen</Text>
      <RouteButton label='go home' path='/(tabs)/home' />
    </ThemedView>
  );
}