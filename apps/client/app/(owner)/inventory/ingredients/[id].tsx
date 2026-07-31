import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

export default function IngredientDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-slate-50 p-6">
      <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2 mb-6">
        <FontAwesome5 name="arrow-left" size={16} color="#64748b" />
        <Text className="text-slate-500 font-medium">Back to Ingredients</Text>
      </TouchableOpacity>
      
      <View className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <Text className="text-2xl font-bold text-slate-800 mb-2">Tomatoes (Fresh)</Text>
        <Text className="text-slate-500 mb-6">Category: Vegetables • SKU: ING-001</Text>
        
        <View className="flex-row gap-4 flex-wrap">
          <View className="bg-slate-50 p-4 rounded-lg flex-1 min-w-[150px]">
            <Text className="text-slate-500 mb-1">Current Stock</Text>
            <Text className="text-xl font-bold text-slate-800">2.5 kg</Text>
          </View>
          <View className="bg-slate-50 p-4 rounded-lg flex-1 min-w-[150px]">
            <Text className="text-slate-500 mb-1">Low Stock Target</Text>
            <Text className="text-xl font-bold text-slate-800">20 kg</Text>
          </View>
          <View className="bg-slate-50 p-4 rounded-lg flex-1 min-w-[150px]">
            <Text className="text-slate-500 mb-1">Preferred Supplier</Text>
            <Text className="text-xl font-bold text-indigo-600">FreshFarm Inc.</Text>
          </View>
        </View>
      </View>

      <Text className="text-xl font-bold text-slate-800 mb-4">Stock Movement History</Text>
      <View className="bg-white rounded-xl border border-slate-200 p-4">
        <View className="flex-row justify-between py-3 border-b border-slate-100">
          <Text className="text-slate-800">Order Consumption</Text>
          <Text className="text-red-500 font-semibold">-0.5 kg</Text>
        </View>
        <View className="flex-row justify-between py-3">
          <Text className="text-slate-800">Purchase Receipt (PO-123)</Text>
          <Text className="text-green-600 font-semibold">+10 kg</Text>
        </View>
      </View>
    </ScrollView>
  );
}
