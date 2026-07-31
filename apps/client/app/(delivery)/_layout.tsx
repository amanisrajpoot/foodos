import { Stack } from 'expo-router';
import React from 'react';

export default function DeliveryLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'My Deliveries',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="[assignmentId]"
        options={{
          title: 'Delivery Task',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
