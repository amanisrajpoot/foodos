import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const INVOICE = {
  id: '1', invoiceNumber: 'INV-171880001', orderNumber: 'ORD-1234', date: '2026-07-06',
  customerName: 'Aman Rajput', customerGstin: '27AAAAA0000A1Z5',
  subtotal: 2700.00, discount: 0, tax: 135.00, total: 2835.00, status: 'ISSUED',
  items: [
    { id: 'i1', name: 'Margherita Pizza', quantity: 1, unitPrice: 1200, total: 1200 },
    { id: 'i2', name: 'Pepperoni Pizza', quantity: 1, unitPrice: 1500, total: 1500 }
  ],
  payments: [
    { method: 'RAZORPAY', amount: 2835.00, txId: 'pay_ABC123XYZ' }
  ]
};

export default function InvoiceDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const handleDownload = () => {
    Alert.alert('Download', 'Downloading PDF...');
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-6 bg-white border-b border-gray-100 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 bg-gray-100 rounded-full">
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-bold text-gray-900">{INVOICE.invoiceNumber}</Text>
            <Text className="text-gray-500">Order: {INVOICE.orderNumber} • {INVOICE.date}</Text>
          </View>
        </View>
        <TouchableOpacity 
          className="bg-blue-600 px-6 py-3 rounded-xl flex-row items-center shadow-sm"
          onPress={handleDownload}
        >
          <Ionicons name="download-outline" size={20} color="white" className="mr-2" />
          <Text className="text-white font-bold ml-2">Download PDF</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="p-6 max-w-4xl w-full self-center">
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <View className="flex-row justify-between border-b border-gray-200 pb-6 mb-6">
            <View>
              <Text className="text-2xl font-black text-gray-900 tracking-tighter">FoodOS</Text>
              <Text className="text-gray-500 mt-2">123 Culinary Street</Text>
              <Text className="text-gray-500">Food City, FC 400001</Text>
              <Text className="text-gray-500 mt-2 font-medium">GSTIN: 27XYZ1234ABCD</Text>
            </View>
            <View className="items-end">
              <Text className="text-3xl font-light text-gray-400">INVOICE</Text>
              <Text className="text-lg font-bold text-gray-900 mt-2">{INVOICE.invoiceNumber}</Text>
              <Text className="text-gray-500">Date: {INVOICE.date}</Text>
            </View>
          </View>

          <View className="flex-row mb-8">
            <View className="flex-1">
              <Text className="text-gray-500 font-bold mb-1">Billed To:</Text>
              <Text className="text-lg font-semibold text-gray-900">{INVOICE.customerName}</Text>
              {INVOICE.customerGstin && <Text className="text-gray-600 mt-1">GSTIN: {INVOICE.customerGstin}</Text>}
            </View>
          </View>

          <View className="border border-gray-200 rounded-lg overflow-hidden mb-8">
            <View className="flex-row bg-gray-50 p-4 border-b border-gray-200">
              <Text className="flex-2 font-bold text-gray-700">Item</Text>
              <Text className="flex-1 font-bold text-gray-700 text-center">Qty</Text>
              <Text className="flex-1 font-bold text-gray-700 text-right">Price</Text>
              <Text className="flex-1 font-bold text-gray-700 text-right">Total</Text>
            </View>
            {INVOICE.items.map((item, idx) => (
              <View key={item.id} className={`flex-row p-4 ${idx !== INVOICE.items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <Text className="flex-2 font-medium text-gray-900">{item.name}</Text>
                <Text className="flex-1 text-gray-600 text-center">{item.quantity}</Text>
                <Text className="flex-1 text-gray-600 text-right">₹{item.unitPrice.toFixed(2)}</Text>
                <Text className="flex-1 font-semibold text-gray-900 text-right">₹{item.total.toFixed(2)}</Text>
              </View>
            ))}
          </View>

          <View className="flex-row justify-end border-b border-gray-200 pb-6 mb-6">
            <View className="w-64">
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Subtotal</Text>
                <Text className="font-semibold text-gray-900">₹{INVOICE.subtotal.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">GST (5%)</Text>
                <Text className="font-semibold text-gray-900">₹{INVOICE.tax.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between pt-4 border-t border-gray-200 mt-2">
                <Text className="text-xl font-bold text-gray-900">Total</Text>
                <Text className="text-xl font-bold text-blue-600">₹{INVOICE.total.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          <View>
            <Text className="text-gray-500 font-bold mb-2">Payment Details</Text>
            {INVOICE.payments.map((p, i) => (
              <Text key={i} className="text-gray-700">
                Paid ₹{p.amount.toFixed(2)} via {p.method} (Txn: {p.txId})
              </Text>
            ))}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
