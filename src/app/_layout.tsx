import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useColorScheme } from 'react-native';
import {
    MD3LightTheme as LightTheme,
    MD3DarkTheme as DarkTheme,
    PaperProvider,
    useTheme,
} from 'react-native-paper';


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : LightTheme
  const t = useTheme()
  return (
    <PaperProvider theme={theme}>
      <Stack 
      screenOptions={{
        headerStyle: {
        backgroundColor: theme.colors.background,
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
    }}
          >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </PaperProvider>
  );
}
