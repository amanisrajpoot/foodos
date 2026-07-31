import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

export default function RecipeEditor() {
  const { menuId, itemId } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-slate-50 p-6">
      <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2 mb-6">
        <FontAwesome5 name="arrow-left" size={16} color="#64748b" />
        <Text className="text-slate-500 font-medium">Back to Item Detail</Text>
      </TouchableOpacity>
      
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-bold text-slate-800">Recipe & Costing</Text>
        <TouchableOpacity className="bg-indigo-600 px-4 py-2 rounded-lg flex-row items-center gap-2">
          <FontAwesome5 name="plus" size={14} color="white" />
          <Text className="text-white font-medium">Add Ingredient</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <Text className="text-lg font-bold text-slate-800 mb-4">Ingredients</Text>
        <View className="flex-row justify-between py-3 border-b border-slate-100">
          <View>
            <Text className="font-semibold text-slate-800">Pizza Dough</Text>
            <Text className="text-slate-500 text-sm">200 g</Text>
          </View>
          <Text className="text-slate-800 font-medium">₹15.00</Text>
        </View>
        <View className="flex-row justify-between py-3 border-b border-slate-100">
          <View>
            <Text className="font-semibold text-slate-800">Mozzarella Cheese</Text>
            <Text className="text-slate-500 text-sm">100 g</Text>
          </View>
          <Text className="text-slate-800 font-medium">₹45.00</Text>
        </View>
      </View>

      <View className="bg-slate-800 rounded-xl p-6 flex-row justify-between items-center shadow-sm">
        <View>
          <Text className="text-slate-400 font-medium mb-1">Estimated Food Cost</Text>
          <Text className="text-3xl font-bold text-white">₹60.00</Text>
        </View>
        <View className="bg-slate-700 px-4 py-3 rounded-xl border border-slate-600">
          <Text className="text-slate-300 text-sm mb-1">Target Sales Price: ₹300.00</Text>
          <Text className="text-green-400 font-bold">20% Food Cost</Text>
        </View>
      </View>
    </ScrollView>
  );
}
