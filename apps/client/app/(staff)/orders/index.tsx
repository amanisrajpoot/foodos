import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

// Mock data
const MOCK_ORDERS = [
  { id: '1', orderNumber: 'ORD-1234', status: 'IN_KITCHEN', table: 'T1', totalMinor: 2700, channel: 'DINE_IN' },
  { id: '2', orderNumber: 'ORD-1235', status: 'READY', table: 'T2', totalMinor: 1500, channel: 'DINE_IN' },
  { id: '3', orderNumber: 'ORD-1236', status: 'ACCEPTED', table: null, totalMinor: 3500, channel: 'TAKEAWAY' },
  { id: '4', orderNumber: 'ORD-1237', status: 'COMPLETED', table: 'T3', totalMinor: 2100, channel: 'DINE_IN' },
];

export default function ActiveOrdersScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState('ALL');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY': return 'bg-green-100 text-green-800';
      case 'IN_KITCHEN': return 'bg-blue-100 text-blue-800';
      case 'ACCEPTED': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-gray-200 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = MOCK_ORDERS.filter(o => filter === 'ALL' || o.status === filter || o.channel === filter);

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <Text className="text-3xl font-bold mb-6 text-gray-900">Active Orders</Text>
      
      {/* Filter Tabs */}
      <View className="flex-row gap-2 mb-8 flex-wrap">
        {['ALL', 'ACCEPTED', 'IN_KITCHEN', 'READY', 'DINE_IN', 'TAKEAWAY'].map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            className={`px-4 py-2 rounded-full border ${filter === f ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-300'}`}
          >
            <Text className={`font-medium ${filter === f ? 'text-white' : 'text-gray-700'}`}>
              {f.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            className="bg-white p-6 rounded-3xl mb-4 shadow-sm border border-gray-100 flex-row justify-between items-center"
            onPress={() => router.push(`/(staff)/orders/${item.id}`)}
          >
            <View>
              <Text className="font-bold text-xl text-gray-900">{item.orderNumber}</Text>
              <View className="flex-row items-center mt-2">
                <Text className="text-gray-500 font-medium">
                  {item.table ? `Table ${item.table}` : item.channel.replace('_', ' ')}
                </Text>
                <Text className="text-gray-300 mx-2">•</Text>
                <Text className="text-gray-900 font-semibold">${(item.totalMinor / 100).toFixed(2)}</Text>
              </View>
            </View>
            <View className={`px-4 py-2 rounded-full ${getStatusColor(item.status).split(' ')[0]}`}>
              <Text className={`font-bold text-sm ${getStatusColor(item.status).split(' ')[1]}`}>
                {item.status.replace('_', ' ')}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text className="text-gray-400 text-center mt-10">No orders match filter</Text>
        )}
      />
    </View>
  );
}
