import React from 'react';
import { View, Text } from 'react-native';

export default function InviteNewStaffScreen() {
  return (
    <View className="flex-1 p-8 bg-slate-50">
      <Text className="text-3xl font-bold text-slate-800 mb-6">Invite Staff</Text>
      <View className="bg-white p-6 rounded-2xl border border-slate-100">
        <Text className="text-slate-500">Invite new team members here.</Text>
      </View>
    </View>
  );
}
