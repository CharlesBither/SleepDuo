import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';

import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerShadowVisible: false,
        headerTintColor: theme.colors.onBackground,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >

      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
          headerTitle: "Overview"
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          title: 'Records',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'newspaper' : 'newspaper-outline'} color={color} size={24} />
          )
        }}
      />
    </Tabs>
  );
}
