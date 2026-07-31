import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

export default function WasteLogList() {
  return (
    <View className="flex-1 bg-slate-50 p-6">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-bold text-slate-800">Waste Log</Text>
        <Link href="/(owner)/inventory/waste/create" asChild>
          <TouchableOpacity className="bg-indigo-600 px-4 py-2 rounded-lg flex-row items-center gap-2">
            <FontAwesome5 name="plus" size={14} color="white" />
            <Text className="text-white font-medium">Log Waste</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <ScrollView className="bg-white rounded-xl border border-slate-200">
        <View className="flex-row justify-between p-4 border-b border-slate-100 items-center">
          <View>
            <Text className="font-semibold text-slate-800">Tomatoes (Fresh)</Text>
            <Text className="text-slate-500 text-sm">Spoiled • 2.5 kg</Text>
          </View>
          <Text className="text-slate-400 text-sm">Today</Text>
        </View>
      </ScrollView>
    </View>
  );
}
