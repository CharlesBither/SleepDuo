import { List, Text, useTheme, Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { supabase } from '@/src/lib/supabase';
import { router } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function SignOutSection() {
  const theme = useTheme();

  const handleSignOutPress = async (): Promise<void> => {
    try {
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      });
      await GoogleSignin.signOut();
      await supabase.auth.signOut();
    } catch (e) {
      console.log('Sign out threw error: ' + e);
    }
    router.replace('/');
  };

  return (
    <List.Section>
      <List.Subheader>Account</List.Subheader>
      <Text style={{ ...styles.margin, color: theme.colors.outline }}>
        Sign out of SleepDuo.
      </Text>
      <Button
        style={{
          ...styles.margin,
          backgroundColor: theme.colors.errorContainer,
        }}
        onPress={handleSignOutPress}
      >
        <Text style={{ color: theme.colors.onErrorContainer }}>Sign out</Text>
      </Button>
    </List.Section>
  );
}

const styles = StyleSheet.create({
  margin: {
    marginHorizontal: 15,
    marginBottom: 5,
  },
});
