import { useTheme, Text } from 'react-native-paper';

import ThemedView from '@/components/ThemedView';

export default function AboutScreen() {
  const theme = useTheme();
  return (
    <ThemedView>
      <Text>About screen</Text>
    </ThemedView>
  );
}