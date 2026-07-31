import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock data
const INVOICES = [
  { id: '1', invoiceNumber: 'INV-171880001', orderNumber: 'ORD-1234', date: '2026-07-06', amount: 2835.00, status: 'ISSUED' },
  { id: '2', invoiceNumber: 'INV-171880002', orderNumber: 'ORD-1235', date: '2026-07-06', amount: 1540.00, status: 'ISSUED' },
  { id: '3', invoiceNumber: 'INV-171880003', orderNumber: 'ORD-1236', date: '2026-07-06', amount: 950.00, status: 'VOIDED' },
];

export default function InvoicesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-6 bg-white border-b border-gray-100 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 bg-gray-100 rounded-full">
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-bold text-gray-900">Invoices</Text>
            <Text className="text-gray-500">Manage billing and invoices</Text>
          </View>
        </View>
        <View className="bg-gray-100 flex-row items-center px-4 py-2 rounded-xl border border-gray-200">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput 
            className="ml-2 w-48 text-gray-900"
            placeholder="Search invoice or order..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView className="p-6">
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <View className="flex-row border-b border-gray-100 bg-gray-50 p-4">
            <Text className="flex-2 font-bold text-gray-600">Invoice #</Text>
            <Text className="flex-1 font-bold text-gray-600">Order #</Text>
            <Text className="flex-1 font-bold text-gray-600">Date</Text>
            <Text className="flex-1 font-bold text-gray-600 text-right">Amount</Text>
            <Text className="flex-1 font-bold text-gray-600 text-center">Status</Text>
            <Text className="w-20 font-bold text-gray-600 text-center">Action</Text>
          </View>

          {/* List */}
          {INVOICES.map((inv, idx) => (
            <View key={inv.id} className={`flex-row p-4 items-center ${idx !== INVOICES.length - 1 ? 'border-b border-gray-50' : ''}`}>
              <Text className="flex-2 font-semibold text-gray-900">{inv.invoiceNumber}</Text>
              <Text className="flex-1 text-gray-600">{inv.orderNumber}</Text>
              <Text className="flex-1 text-gray-600">{inv.date}</Text>
              <Text className="flex-1 font-bold text-gray-900 text-right">₹{inv.amount.toFixed(2)}</Text>
              <View className="flex-1 items-center">
                <View className={`px-2 py-1 rounded-md ${inv.status === 'ISSUED' ? 'bg-green-100' : 'bg-red-100'}`}>
                  <Text className={`text-xs font-bold ${inv.status === 'ISSUED' ? 'text-green-800' : 'text-red-800'}`}>{inv.status}</Text>
                </View>
              </View>
              <TouchableOpacity 
                className="w-20 items-center bg-blue-50 py-2 rounded-lg"
                onPress={() => router.push(`/(owner)/finance/invoices/${inv.id}`)}
              >
                <Text className="text-blue-700 font-semibold text-sm">View</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
