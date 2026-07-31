import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function LogWasteEntry() {
  const router = useRouter();
  
  return (
    <ScrollView className="flex-1 bg-slate-50 p-6">
      <Text className="text-2xl font-bold text-slate-800 mb-6">Log Waste</Text>
      
      <View className="bg-white p-6 rounded-xl border border-slate-200">
        <View className="mb-4">
          <Text className="text-slate-700 font-medium mb-2">Select Ingredient</Text>
          <TextInput className="bg-slate-50 border border-slate-200 rounded-lg p-3" placeholder="Search ingredient..." />
        </View>
        <View className="mb-4">
          <Text className="text-slate-700 font-medium mb-2">Quantity Wasted</Text>
          <TextInput className="bg-slate-50 border border-slate-200 rounded-lg p-3" placeholder="e.g. 2.5" keyboardType="numeric" />
        </View>
        <View className="mb-4">
          <Text className="text-slate-700 font-medium mb-2">Reason</Text>
          <View className="flex-row gap-2 flex-wrap">
            <TouchableOpacity className="bg-indigo-100 px-4 py-2 rounded-full border border-indigo-200"><Text className="text-indigo-700">Spoiled</Text></TouchableOpacity>
            <TouchableOpacity className="bg-slate-100 px-4 py-2 rounded-full border border-slate-200"><Text className="text-slate-700">Expired</Text></TouchableOpacity>
            <TouchableOpacity className="bg-slate-100 px-4 py-2 rounded-full border border-slate-200"><Text className="text-slate-700">Prep Loss</Text></TouchableOpacity>
            <TouchableOpacity className="bg-slate-100 px-4 py-2 rounded-full border border-slate-200"><Text className="text-slate-700">Order Mistake</Text></TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => router.back()} className="bg-indigo-600 p-4 rounded-lg items-center mt-4">
          <Text className="text-white font-bold text-lg">Submit Waste Log</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
