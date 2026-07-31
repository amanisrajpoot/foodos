import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCartStore } from '../../../stores/cartStore';

export default function TableDetailScreen() {
  const { tableId } = useLocalSearchParams();
  const router = useRouter();
  const { setTableId, setChannel } = useCartStore();

  const handleTakeOrder = () => {
    setTableId(tableId as string);
    setChannel('DINE_IN');
    router.push('/(staff)/new-order');
  };

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <View className="flex-row items-center justify-between mb-8">
        <Text className="text-3xl font-bold text-gray-900">Table {tableId}</Text>
        <TouchableOpacity 
          className="bg-gray-200 px-6 py-3 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-gray-900 font-bold">Back</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex-row flex-wrap gap-4">
        <TouchableOpacity 
          className="w-48 h-32 bg-blue-600 rounded-2xl items-center justify-center shadow-md shadow-blue-200"
          onPress={handleTakeOrder}
        >
          <Text className="text-white font-bold text-xl">Take Order</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="w-48 h-32 bg-white border-2 border-gray-200 rounded-2xl items-center justify-center"
        >
          <Text className="text-gray-900 font-bold text-xl">Call Bill</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="w-48 h-32 bg-white border-2 border-gray-200 rounded-2xl items-center justify-center"
        >
          <Text className="text-gray-900 font-bold text-xl">Clear Table</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
