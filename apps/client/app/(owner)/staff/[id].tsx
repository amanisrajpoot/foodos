import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function StaffDetailScreen() {
  const { id } = useLocalSearchParams();
  return (
    <View className="flex-1 p-8 bg-slate-50">
      <Text className="text-3xl font-bold text-slate-800 mb-6">Staff Details</Text>
      <View className="bg-white p-6 rounded-2xl border border-slate-100">
        <Text className="text-slate-500">Details for Staff {id} will appear here.</Text>
      </View>
    </View>
  );
}
