import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

export default function SuppliersList() {
  return (
    <View className="flex-1 bg-slate-50 p-6">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-bold text-slate-800">Suppliers</Text>
        <TouchableOpacity className="bg-indigo-600 px-4 py-2 rounded-lg flex-row items-center gap-2">
          <FontAwesome5 name="plus" size={14} color="white" />
          <Text className="text-white font-medium">Add Supplier</Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="bg-white rounded-xl border border-slate-200">
        <Link href="/(owner)/inventory/suppliers/1" asChild>
          <TouchableOpacity className="flex-row justify-between p-4 border-b border-slate-100 items-center">
            <View>
              <Text className="font-semibold text-slate-800">FreshFarm Inc.</Text>
              <Text className="text-slate-500 text-sm">Contact: John Doe • Net 30 Days</Text>
            </View>
            <FontAwesome5 name="chevron-right" size={14} color="#94a3b8" />
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </View>
  );
}
