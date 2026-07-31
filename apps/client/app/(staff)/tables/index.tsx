import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

// Mock data
const TABLES = [
  { id: 'T1', label: 'T1', status: 'OCCUPIED' },
  { id: 'T2', label: 'T2', status: 'AVAILABLE' },
  { id: 'T3', label: 'T3', status: 'RESERVED' },
  { id: 'T4', label: 'T4', status: 'AVAILABLE' },
];

export default function TablesScreen() {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 border-green-300';
      case 'OCCUPIED': return 'bg-red-100 border-red-300';
      case 'RESERVED': return 'bg-yellow-100 border-yellow-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <Text className="text-3xl font-bold mb-8 text-gray-900">Dining Tables</Text>
      
      <View className="flex-row flex-wrap gap-4">
        {TABLES.map(table => (
          <TouchableOpacity
            key={table.id}
            className={`w-32 h-32 rounded-3xl items-center justify-center border-2 ${getStatusColor(table.status)}`}
            onPress={() => router.push(`/(staff)/tables/${table.id}`)}
          >
            <Text className="text-2xl font-bold text-gray-900">{table.label}</Text>
            <Text className="text-sm font-medium text-gray-600 mt-2">{table.status}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
