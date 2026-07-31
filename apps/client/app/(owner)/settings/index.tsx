import React from 'react';
import { View, Text } from 'react-native';

export default function SettingsScreen() {
  return (
    <View className="flex-1 p-8 bg-slate-50">
      <Text className="text-3xl font-bold text-slate-800 mb-6">Organization Settings</Text>
      <View className="bg-white p-6 rounded-2xl border border-slate-100">
        <Text className="text-slate-500">Manage organization-wide settings here.</Text>
      </View>
    </View>
  );
}
