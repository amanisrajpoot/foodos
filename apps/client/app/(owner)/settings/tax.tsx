import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TaxCategoriesScreen() {
  return (
    <View className="flex-1 bg-slate-50">
      <View className="p-8 pb-4 flex-row justify-between items-center">
        <View>
          <Text className="text-4xl font-bold text-slate-800 tracking-tight">Tax Categories</Text>
          <Text className="text-slate-500 mt-1">Manage GST and other taxes</Text>
        </View>
        <TouchableOpacity className="bg-indigo-600 px-6 py-3 rounded-full flex-row items-center shadow-sm">
          <Ionicons name="add" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Add Tax Category</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-8">
        <View className="bg-white p-6 rounded-3xl mb-4 border border-slate-100 shadow-sm flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold text-slate-800">GST 5%</Text>
            <Text className="text-sm text-slate-500 mt-1">5% • Exclusive • ACTIVE</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="create-outline" size={24} color="#64748b" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
