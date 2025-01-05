
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Stack, Tabs } from "expo-router";

export default function App() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" 
      options={{headerShown: false}}
      />
    </Stack>
  )
}