import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function AdjustStock() {
  const router = useRouter();
  
  return (
    <ScrollView className="flex-1 bg-slate-50 p-6">
      <Text className="text-2xl font-bold text-slate-800 mb-6">Manual Stock Adjustment</Text>
      
      <View className="bg-white p-6 rounded-xl border border-slate-200">
        <View className="mb-4">
          <Text className="text-slate-700 font-medium mb-2">Select Ingredient</Text>
          <TextInput className="bg-slate-50 border border-slate-200 rounded-lg p-3" placeholder="Search ingredient..." />
        </View>
        <View className="mb-4">
          <Text className="text-slate-700 font-medium mb-2">Quantity Delta (use - for reduction)</Text>
          <TextInput className="bg-slate-50 border border-slate-200 rounded-lg p-3" placeholder="-1.5" keyboardType="numeric" />
        </View>
        <View className="mb-6">
          <Text className="text-slate-700 font-medium mb-2">Reason</Text>
          <TextInput className="bg-slate-50 border border-slate-200 rounded-lg p-3" placeholder="e.g. Found extra in freezer" />
        </View>

        <TouchableOpacity onPress={() => router.back()} className="bg-indigo-600 p-4 rounded-lg items-center">
          <Text className="text-white font-bold text-lg">Record Adjustment</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
