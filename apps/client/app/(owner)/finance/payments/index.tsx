import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock data
const PAYMENTS = [
  { id: '1', paymentNumber: 'PAY-1001', orderNumber: 'ORD-1234', method: 'RAZORPAY', amount: 2835.00, status: 'CAPTURED', date: '2026-07-06 14:30' },
  { id: '2', paymentNumber: 'PAY-1002', orderNumber: 'ORD-1235', method: 'CASH', amount: 1540.00, status: 'CAPTURED', date: '2026-07-06 15:10' },
  { id: '3', paymentNumber: 'PAY-1003', orderNumber: 'ORD-1236', method: 'UPI', amount: 950.00, status: 'FAILED', date: '2026-07-06 16:05' },
];

export default function PaymentsLogScreen() {
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
            <Text className="text-2xl font-bold text-gray-900">Payments Log</Text>
            <Text className="text-gray-500">Track all payment transactions</Text>
          </View>
        </View>
        <View className="bg-gray-100 flex-row items-center px-4 py-2 rounded-xl border border-gray-200">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput 
            className="ml-2 w-48 text-gray-900"
            placeholder="Search payments..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView className="p-6">
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <View className="flex-row border-b border-gray-100 bg-gray-50 p-4">
            <Text className="flex-2 font-bold text-gray-600">Payment ID</Text>
            <Text className="flex-1 font-bold text-gray-600">Order #</Text>
            <Text className="flex-1 font-bold text-gray-600">Method</Text>
            <Text className="flex-2 font-bold text-gray-600">Date & Time</Text>
            <Text className="flex-1 font-bold text-gray-600 text-right">Amount</Text>
            <Text className="flex-1 font-bold text-gray-600 text-center">Status</Text>
          </View>

          {/* List */}
          {PAYMENTS.map((pay, idx) => (
            <View key={pay.id} className={`flex-row p-4 items-center ${idx !== PAYMENTS.length - 1 ? 'border-b border-gray-50' : ''}`}>
              <Text className="flex-2 font-semibold text-gray-900">{pay.paymentNumber}</Text>
              <Text className="flex-1 text-gray-600">{pay.orderNumber}</Text>
              <Text className="flex-1 font-medium text-gray-700">{pay.method}</Text>
              <Text className="flex-2 text-gray-500 text-sm">{pay.date}</Text>
              <Text className="flex-1 font-bold text-gray-900 text-right">₹{pay.amount.toFixed(2)}</Text>
              <View className="flex-1 items-center">
                <View className={`px-2 py-1 rounded-md ${
                  pay.status === 'CAPTURED' ? 'bg-green-100' : 
                  pay.status === 'FAILED' ? 'bg-red-100' : 'bg-yellow-100'
                }`}>
                  <Text className={`text-xs font-bold ${
                    pay.status === 'CAPTURED' ? 'text-green-800' : 
                    pay.status === 'FAILED' ? 'text-red-800' : 'text-yellow-800'
                  }`}>{pay.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
