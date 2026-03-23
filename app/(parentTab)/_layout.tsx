import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#FF5252', 
      tabBarStyle: { backgroundColor: '#121212', borderTopWidth: 0 },
      headerStyle: { backgroundColor: '#121212' },
      headerTintColor: '#fff' 
    }}>
      <Tabs.Screen
        name="home"
        options={{
          title: '实时监控',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="heartbeat" color={color} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: '子女通信',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="users" color={color} />,
        }}
      />
    </Tabs>
  );
}