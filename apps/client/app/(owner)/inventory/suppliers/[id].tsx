import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

export default function SupplierDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-slate-50 p-6">
      <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2 mb-6">
        <FontAwesome5 name="arrow-left" size={16} color="#64748b" />
        <Text className="text-slate-500 font-medium">Back to Suppliers</Text>
      </TouchableOpacity>
      
      <View className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <Text className="text-2xl font-bold text-slate-800 mb-1">FreshFarm Inc.</Text>
        <Text className="text-green-600 text-sm font-medium mb-4">ACTIVE</Text>
        
        <View className="flex-row gap-8">
          <View>
            <Text className="text-slate-500 mb-1">Contact</Text>
            <Text className="font-medium text-slate-800">John Doe (555-0192)</Text>
          </View>
          <View>
            <Text className="text-slate-500 mb-1">Terms</Text>
            <Text className="font-medium text-slate-800">Net 30 Days</Text>
          </View>
        </View>
      </View>

      <Text className="text-xl font-bold text-slate-800 mb-4">Recent Purchase Orders</Text>
      <View className="bg-white rounded-xl border border-slate-200">
        <View className="flex-row justify-between p-4 border-b border-slate-100 items-center">
          <View>
            <Text className="font-semibold text-slate-800">PO-10023</Text>
            <Text className="text-slate-500 text-sm">Ordered: 01 Jul 2026</Text>
          </View>
          <Text className="text-blue-600 font-medium">RECEIVED</Text>
        </View>
      </View>
    </ScrollView>
  );
}
