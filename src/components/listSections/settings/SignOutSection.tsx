import { List, Text, useTheme, Button } from "react-native-paper";
import { StyleSheet } from "react-native";
import { supabase } from "@/src/lib/supabase";
import { router } from "expo-router";

export default function SignOutSection() {
  const theme = useTheme();

  const handleSignOutPress = async (): Promise<void> => {
    await supabase.auth.signOut();
    router.replace("/");
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
