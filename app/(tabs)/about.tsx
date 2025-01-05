import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function AboutScreen() {
  const theme = useTheme();
  return (
    <View style={{ 
      backgroundColor: theme.colors.background, 
      flex: 1 
      }}>
      <Text style={styles.text}>About screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});
