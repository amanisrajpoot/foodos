import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/auth.store';

export default function DeliveryLayout() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#f8fafc',
        headerTitleStyle: { fontWeight: '800' },
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              logout();
              router.replace('/(auth)/login');
            }}
            className="mr-2"
          >
            <View className="bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20 flex-row items-center">
              <Ionicons name="log-out-outline" size={14} color="#fb7185" style={{ marginRight: 4 }} />
              <Text className="text-rose-400 font-bold text-xs">End Shift</Text>
            </View>
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Active Fleet Dashboard',
        }}
      />
      <Stack.Screen
        name="[assignmentId]"
        options={{
          title: 'Delivery Task',
        }}
      />
    </Stack>
  );
}
