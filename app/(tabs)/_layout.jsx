
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Stack, Tabs } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function TabsLayout() {
  return (
  <Tabs
    screenOptions={({route}) => ({
      tabBarIcon: ({focused, color, size}) => {
        let iconName;
        let rn = route.name;

        if (rn === "index") {
          iconName = focused ? 'home' : 'home-outline'
        } else if (rn === "Movies") {
          iconName = focused ? 'film' : 'film-outline'
        } else if (rn === "Shows") {
          iconName = focused ? "tv" : "tv-outline"
        } else if (rn === "Profile") {
          iconName = focused ? "person" : "person-outline"
        }

        return <Ionicons name={iconName} size={22} color="white"/>
      },
      headerShown: false,
      tabBarStyle: { backgroundColor: '#1a202c' }, // Styl paska nawigacji
      tabBarActiveTintColor: '#63b3ed', // Aktywny kolor
      tabBarInactiveTintColor: '#a0aec0', // Nieaktywny kolor
    })}>
      <Tabs.Screen name='index' options={{
        title: 'Home'
      }}/>
      <Tabs.Screen name='Movies' options={{
        title: 'Movies',
      }} />
      <Tabs.Screen name='Shows' options={{
        title: 'Shows',
      }} />
      <Tabs.Screen name='Profile' options={{
        title: 'Profile',
      }} />
    </Tabs>
  );
}