import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';

// Mock data for Sprint 3/7
const ORDER = {
  id: '1', orderNumber: 'ORD-1234', status: 'IN_KITCHEN', table: 'T1', totalMinor: 2700,
  channel: 'DELIVERY',
  delivery: {
    status: 'OUT_FOR_DELIVERY',
    provider: 'LOCAL_FLEET',
    driverName: 'John Doe',
  },
  history: [
    { status: 'ACCEPTED', time: '12:00 PM' },
    { status: 'IN_KITCHEN', time: '12:05 PM' }
  ],
  items: [
    { id: 'i1', name: 'Margherita Pizza', quantity: 1, unitPriceMinor: 1200, status: 'PREPARING' },
    { id: 'i2', name: 'Pepperoni Pizza', quantity: 1, unitPriceMinor: 1500, status: 'QUEUED' }
  ]
};

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-6 bg-white border-b border-gray-100 flex-row items-center justify-between">
        <View>
          <Text className="text-3xl font-bold text-gray-900">{ORDER.orderNumber}</Text>
          <Text className="text-gray-500 font-medium mt-1">Table {ORDER.table} • {ORDER.status}</Text>
        </View>
        <TouchableOpacity 
          className="bg-gray-200 px-6 py-3 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-gray-900 font-bold">Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="p-6">
        {/* Status Timeline */}
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
          <Text className="text-lg font-bold mb-4 text-gray-900">Timeline</Text>
          <View className="flex-row">
            {['PLACED', 'ACCEPTED', 'IN_KITCHEN', 'READY', 'COMPLETED'].map((step, idx) => {
              const passed = ORDER.history.some(h => h.status === step) || step === 'PLACED';
              return (
                <View key={step} className="flex-1 items-center">
                  <View className={`w-4 h-4 rounded-full mb-2 ${passed ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  <Text className="text-xs text-center text-gray-600 font-medium">{step.replace('_', ' ')}</Text>
                </View>
              )
            })}
          </View>
        </View>

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

        <Text className="text-xl font-bold mb-4 text-gray-900">Items</Text>
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          {ORDER.items.map(item => (
            <View key={item.id} className="flex-row justify-between items-center mb-4 border-b border-gray-50 pb-4 last:border-0 last:mb-0 last:pb-0">
              <View>
                <Text className="font-bold text-lg text-gray-800">{item.name}</Text>
                <Text className="text-gray-500 mt-1">Qty: {item.quantity}</Text>
              </View>
              <View className="items-end">
                <Text className="font-semibold text-gray-900">${(item.unitPriceMinor / 100).toFixed(2)}</Text>
                <Text className="text-blue-600 text-sm mt-1 font-medium">{item.status}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className="mt-8 flex-row gap-4 pb-10">
          <Link href={`/(staff)/orders/${id}/pay`} asChild>
            <TouchableOpacity className="flex-1 bg-blue-600 p-4 rounded-xl items-center shadow-sm">
              <Text className="text-white font-bold text-lg">Pay / Settle</Text>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity className="flex-1 bg-green-600 p-4 rounded-xl items-center shadow-sm">
            <Text className="text-white font-bold text-lg">Mark Served</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-white border border-gray-300 p-4 rounded-xl items-center shadow-sm">
            <Text className="text-gray-800 font-bold text-lg">Modify</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

