import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function CreatePurchaseOrder() {
  const router = useRouter();
  
  return (
    <ScrollView className="flex-1 bg-slate-50 p-6">
      <Text className="text-2xl font-bold text-slate-800 mb-6">Create Purchase Order</Text>
      
      <View className="bg-white p-6 rounded-xl border border-slate-200">
        <View className="mb-4">
          <Text className="text-slate-700 font-medium mb-2">Select Supplier</Text>
          <TextInput className="bg-slate-50 border border-slate-200 rounded-lg p-3" placeholder="Search supplier..." />
        </View>
        
        <View className="border-t border-slate-200 pt-4 mt-2 mb-6">
          <Text className="text-lg font-bold text-slate-800 mb-4">Line Items</Text>
          <View className="bg-slate-50 p-4 rounded-lg border border-dashed border-slate-300 items-center justify-center">
            <Text className="text-indigo-600 font-medium">+ Add Ingredient</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => router.back()} className="bg-indigo-600 p-4 rounded-lg items-center">
          <Text className="text-white font-bold text-lg">Save as Draft</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
