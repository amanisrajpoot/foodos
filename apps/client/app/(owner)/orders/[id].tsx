import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const ORDER = {
  id: '1', orderNumber: 'ORD-1234', branch: 'Downtown', status: 'IN_KITCHEN', table: 'T1', totalMinor: 2700,
  channel: 'DELIVERY', // Example channel
  delivery: {
    status: 'OUT_FOR_DELIVERY',
    provider: 'LOCAL_FLEET',
    driverName: 'John Doe',
  },
  items: [
    { id: 'i1', name: 'Margherita Pizza', quantity: 1, unitPriceMinor: 1200 },
    { id: 'i2', name: 'Pepperoni Pizza', quantity: 1, unitPriceMinor: 1500 }
  ]
};

export default function OwnerOrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-6 bg-white border-b border-gray-100 flex-row items-center justify-between">
        <View>
          <Text className="text-3xl font-bold text-gray-900">{ORDER.orderNumber}</Text>
          <Text className="text-gray-500 font-medium mt-1">Branch: {ORDER.branch} • {ORDER.status}</Text>
        </View>
        <TouchableOpacity 
          className="bg-gray-200 px-6 py-3 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-gray-900 font-bold">Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="p-6">
        {ORDER.channel === 'DELIVERY' && ORDER.delivery && (
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
            <Text className="text-xl font-bold mb-4 text-gray-900 border-b border-gray-50 pb-4">Delivery Details</Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500 text-lg">Status</Text>
              <Text className="font-semibold text-lg text-blue-600">{ORDER.delivery.status}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500 text-lg">Provider</Text>
              <Text className="font-semibold text-lg">{ORDER.delivery.provider}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500 text-lg">Driver</Text>
              <Text className="font-semibold text-lg">{ORDER.delivery.driverName || 'Unassigned'}</Text>
            </View>
          </View>
        )}

        <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <Text className="text-xl font-bold mb-6 text-gray-900 border-b border-gray-50 pb-4">Order Items</Text>
          {ORDER.items.map(item => (
            <View key={item.id} className="flex-row justify-between items-center mb-4 pb-4 border-b border-gray-50 last:border-0 last:mb-0 last:pb-0">
              <View>
                <Text className="font-bold text-lg text-gray-800">{item.name}</Text>
                <Text className="text-gray-500 mt-1">Qty: {item.quantity}</Text>
              </View>
              <Text className="font-semibold text-gray-900 text-lg">${(item.unitPriceMinor / 100).toFixed(2)}</Text>
            </View>
          ))}
          <View className="flex-row justify-between mt-6 pt-4 border-t border-gray-100">
            <Text className="text-xl font-bold text-gray-900">Total</Text>
            <Text className="text-xl font-bold text-blue-600">${(ORDER.totalMinor / 100).toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

