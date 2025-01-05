import { View, type ViewProps } from 'react-native';
import { useTheme } from 'react-native-paper';

export type ThemedViewProps = ViewProps;

export default function ThemedView({ ...Props }: ThemedViewProps) {
    const theme = useTheme();
  return (
    <View 
    style={{ 
        backgroundColor: theme.colors.background,
        flex: 1
    }}
    { ...Props }
    />

  );
}