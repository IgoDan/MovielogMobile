
import React from 'react';
import { Stack, Tabs } from "expo-router";

export default function App() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" 
      options={{headerShown: false}}
      />
      <Stack.Screen name="[type]/[id]" 
      options={{
        title: 'Details',
        headerStyle: { backgroundColor: '#2d3748' },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        }
      }}
      />
    </Stack>
  )
}