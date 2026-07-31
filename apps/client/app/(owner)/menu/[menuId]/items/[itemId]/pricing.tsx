import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ItemPricingScreen() {
  const { menuId, itemId } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-slate-50">
      <View className="p-8 pb-4 flex-row justify-between items-center">
        <View>
          <Link href={`/(owner)/menu/${menuId}/items/${itemId}`} asChild>
            <TouchableOpacity className="flex-row items-center mb-4">
              <Ionicons name="arrow-back" size={20} color="#6366f1" />
              <Text className="text-indigo-600 font-medium ml-2">Back to Item</Text>
            </TouchableOpacity>
          </Link>
          <Text className="text-3xl font-bold text-slate-800 tracking-tight">Pricing Rules</Text>
        </View>
        <TouchableOpacity className="bg-emerald-600 px-6 py-3 rounded-full flex-row items-center shadow-sm">
          <Ionicons name="add" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Add Price Rule</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-8">
        <View className="bg-white p-6 rounded-3xl mb-4 border border-slate-100 shadow-sm flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold text-slate-800">₹299</Text>
            <Text className="text-sm text-slate-500 mt-1">Channel: DELIVERY • Priority: 10</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="trash-outline" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
