import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

export default function PurchaseOrdersList() {
  return (
    <View className="flex-1 bg-slate-50 p-6">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-bold text-slate-800">Purchase Orders</Text>
        <Link href="/(owner)/inventory/purchase-orders/create" asChild>
          <TouchableOpacity className="bg-indigo-600 px-4 py-2 rounded-lg flex-row items-center gap-2">
            <FontAwesome5 name="plus" size={14} color="white" />
            <Text className="text-white font-medium">Create PO</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <ScrollView className="bg-white rounded-xl border border-slate-200">
        <Link href="/(owner)/inventory/purchase-orders/1" asChild>
          <TouchableOpacity className="flex-row justify-between p-4 border-b border-slate-100 items-center">
            <View>
              <Text className="font-bold text-slate-800 mb-1">PO-10024</Text>
              <Text className="text-slate-500 text-sm">Supplier: FreshFarm Inc. • ₹1,250.00</Text>
            </View>
            <View className="bg-amber-100 px-3 py-1 rounded-full">
              <Text className="text-amber-800 text-xs font-bold">DRAFT</Text>
            </View>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </View>
  );
}
