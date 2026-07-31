import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

export default function PurchaseOrderDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-slate-50 p-6">
      <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2 mb-6">
        <FontAwesome5 name="arrow-left" size={16} color="#64748b" />
        <Text className="text-slate-500 font-medium">Back to POs</Text>
      </TouchableOpacity>
      
      <View className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-slate-800">PO-10024</Text>
          <View className="bg-amber-100 px-3 py-1 rounded-full">
            <Text className="text-amber-800 text-xs font-bold">DRAFT</Text>
          </View>
        </View>
        <Text className="text-slate-500 mb-6">Supplier: FreshFarm Inc.</Text>
        
        <View className="flex-row gap-4">
          <TouchableOpacity className="bg-indigo-600 px-4 py-2 rounded-lg flex-1 items-center">
            <Text className="text-white font-medium">Send Order</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-slate-200 px-4 py-2 rounded-lg flex-1 items-center">
            <Text className="text-slate-800 font-medium">Receive Goods</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text className="text-xl font-bold text-slate-800 mb-4">Line Items</Text>
      <View className="bg-white rounded-xl border border-slate-200 p-4">
        <View className="flex-row justify-between py-2 border-b border-slate-100 items-center">
          <View>
            <Text className="font-semibold text-slate-800">Tomatoes (Fresh)</Text>
            <Text className="text-slate-500 text-sm">20 kg @ ₹45/kg</Text>
          </View>
          <Text className="text-slate-800 font-bold">₹900.00</Text>
        </View>
        <View className="flex-row justify-between py-4 items-center mt-2">
          <Text className="font-bold text-slate-800">Total</Text>
          <Text className="text-xl font-bold text-indigo-600">₹900.00</Text>
        </View>
      </View>
    </ScrollView>
  );
}
