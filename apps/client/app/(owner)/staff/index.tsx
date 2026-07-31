import React from 'react';
import { View, Text } from 'react-native';

export default function StaffScreen() {
  return (
    <View className="flex-1 p-8 bg-slate-50">
      <Text className="text-3xl font-bold text-slate-800 mb-6">Staff</Text>
      <View className="bg-white p-6 rounded-2xl border border-slate-100">
        <Text className="text-slate-500">List of all employees across branches.</Text>
      </View>
    </View>
  );
}
