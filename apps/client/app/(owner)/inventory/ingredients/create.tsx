import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function CreateIngredient() {
  const router = useRouter();
  
  return (
    <ScrollView className="flex-1 bg-slate-50 p-6">
      <Text className="text-2xl font-bold text-slate-800 mb-6">Add New Ingredient</Text>
      
      <View className="bg-white p-6 rounded-xl border border-slate-200">
        <View className="mb-4">
          <Text className="text-slate-700 font-medium mb-2">Name</Text>
          <TextInput className="bg-slate-50 border border-slate-200 rounded-lg p-3" placeholder="e.g. Tomato (Fresh)" />
        </View>
        <View className="mb-4">
          <Text className="text-slate-700 font-medium mb-2">Category</Text>
          <TextInput className="bg-slate-50 border border-slate-200 rounded-lg p-3" placeholder="e.g. Vegetables" />
        </View>
        <View className="flex-row gap-4 mb-4">
          <View className="flex-1">
            <Text className="text-slate-700 font-medium mb-2">Base Unit</Text>
            <TextInput className="bg-slate-50 border border-slate-200 rounded-lg p-3" placeholder="e.g. kg" />
          </View>
          <View className="flex-1">
            <Text className="text-slate-700 font-medium mb-2">Purchase Unit</Text>
            <TextInput className="bg-slate-50 border border-slate-200 rounded-lg p-3" placeholder="e.g. Crate" />
          </View>
        </View>
        <View className="mb-6">
          <Text className="text-slate-700 font-medium mb-2">Low Stock Threshold</Text>
          <TextInput className="bg-slate-50 border border-slate-200 rounded-lg p-3" placeholder="20" keyboardType="numeric" />
        </View>

        <TouchableOpacity onPress={() => router.back()} className="bg-indigo-600 p-4 rounded-lg items-center">
          <Text className="text-white font-bold text-lg">Save Ingredient</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
