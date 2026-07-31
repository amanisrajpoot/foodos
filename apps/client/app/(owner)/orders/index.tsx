import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

// Mock data
const MOCK_ORDERS = [
  { id: '1', orderNumber: 'ORD-1234', branch: 'Downtown', status: 'IN_KITCHEN', totalMinor: 2700, channel: 'DINE_IN' },
  { id: '2', orderNumber: 'ORD-1235', branch: 'Uptown', status: 'COMPLETED', totalMinor: 4500, channel: 'DELIVERY' },
  { id: '3', orderNumber: 'ORD-1236', branch: 'Downtown', status: 'PLACED', totalMinor: 1200, channel: 'TAKEAWAY' },
];

export default function OwnerOrdersFeed() {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-gray-100 text-gray-600';
      case 'IN_KITCHEN': return 'bg-blue-100 text-blue-800';
      case 'PLACED': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <Text className="text-3xl font-bold mb-2 text-gray-900">Live Order Feed</Text>
      <Text className="text-gray-500 mb-8 font-medium">Monitoring all branches</Text>
      
      <FlatList
        data={MOCK_ORDERS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            className="bg-white p-6 rounded-3xl mb-4 shadow-sm border border-gray-100 flex-row justify-between items-center"
            onPress={() => router.push(`/(owner)/orders/${item.id}`)}
          >
            <View>
              <Text className="font-bold text-xl text-gray-900">{item.orderNumber}</Text>
              <View className="flex-row items-center mt-2">
                <Text className="text-gray-500 font-medium">{item.branch}</Text>
                <Text className="text-gray-300 mx-2">•</Text>
                <Text className="text-gray-500 font-medium">{item.channel.replace('_', ' ')}</Text>
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
      />
    </View>
  );
}
