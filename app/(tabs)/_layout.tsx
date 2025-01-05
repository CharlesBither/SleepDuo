import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';

import Ionicons from '@expo/vector-icons/Ionicons';


export default function TabLayout() {
  const theme = useTheme();
  return (
    <Tabs
        screenOptions={{
            tabBarActiveTintColor: '#ffd33d',
            headerStyle: {
            backgroundColor: theme.colors.background,
            },
            headerShadowVisible: false,
            headerTintColor: '#fff',
            tabBarStyle: {
            backgroundColor: theme.colors.background,
            },
        }}
        >

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
          ),
        }}
      />
    </Tabs>
  );
}
