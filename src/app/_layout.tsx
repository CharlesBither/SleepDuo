import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useColorScheme } from 'react-native';
import {
  MD3LightTheme as LightTheme,
  MD3DarkTheme as DarkTheme,
  PaperProvider,
} from 'react-native-paper';


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const paperTheme = colorScheme === 'dark' ? DarkTheme : LightTheme
  return (
    <PaperProvider theme={paperTheme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: paperTheme.colors.background,
            },
            headerShadowVisible: false,
            headerTintColor: paperTheme.colors.onBackground,
            presentation: "transparentModal",
          }}
        >
          <Stack.Screen name="index" options={{
            headerTitle: "",
          }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="components/pages/JournalEntryEdit" options={{
            headerTitle: "",
          }}
           />
          <Stack.Screen name="components/pages/Auth/Auth" options={{
            headerTitle: "Login",
          }} />
        </Stack>
        <StatusBar style={ colorScheme === 'dark' ? 'light' : 'dark' } />
    </PaperProvider>
  );
}
