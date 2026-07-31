import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data
const ORDER = {
  id: '1', orderNumber: 'ORD-1234', status: 'IN_KITCHEN', table: 'T1', 
  subtotalMinor: 270000, taxMinor: 13500, totalMinor: 283500,
  items: [
    { id: 'i1', name: 'Margherita Pizza', quantity: 1, lineTotalMinor: 120000 },
    { id: 'i2', name: 'Pepperoni Pizza', quantity: 1, lineTotalMinor: 150000 }
  ]
};

export default function PayOrderScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [method, setMethod] = useState<'CASH' | 'RAZORPAY' | 'UPI' | 'CARD' | null>(null);
  const [splitType, setSplitType] = useState<'FULL' | 'EQUAL' | 'AMOUNT' | 'ITEM'>('FULL');
  
  // Cash handling
  const [receivedAmount, setReceivedAmount] = useState('');
  const amountToPay = ORDER.totalMinor / 100;
  
  const handlePayment = () => {
    if (!method) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }
    
    if (method === 'CASH') {
      const received = parseFloat(receivedAmount);
      if (isNaN(received) || received < amountToPay) {
        Alert.alert('Error', 'Insufficient amount received');
        return;
      }
      const change = received - amountToPay;
      Alert.alert('Success', `Payment recorded. Change to return: ₹${change.toFixed(2)}`, [
        { text: 'OK', onPress: () => router.push('/(staff)/orders') }
      ]);
    } else {
      // Mock digital payment
      Alert.alert('Processing', `Initiating ${method} payment...`, [
        { text: 'Simulate Success', onPress: () => {
          Alert.alert('Success', 'Payment captured successfully.', [
            { text: 'Print Receipt', onPress: () => router.push('/(staff)/orders') }
          ]);
        }}
      ]);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="p-4 bg-white border-b border-gray-100 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold text-gray-900">Checkout {ORDER.orderNumber}</Text>
          <Text className="text-gray-500 font-medium">Table {ORDER.table}</Text>
        </View>
        <TouchableOpacity 
          className="bg-gray-100 px-4 py-2 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-gray-900 font-bold">Cancel</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="p-4">
        {/* Bill Preview */}
        <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
          <Text className="text-lg font-bold mb-4 text-gray-900 border-b border-gray-100 pb-2">Bill Summary</Text>
          {ORDER.items.map(item => (
            <View key={item.id} className="flex-row justify-between mb-2">
              <Text className="text-gray-700">{item.quantity}x {item.name}</Text>
              <Text className="text-gray-900">₹{(item.lineTotalMinor / 100).toFixed(2)}</Text>
            </View>
          ))}
          <View className="border-t border-gray-100 mt-2 pt-2">
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-500">Subtotal</Text>
              <Text className="text-gray-900">₹{(ORDER.subtotalMinor / 100).toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500">GST (5%)</Text>
              <Text className="text-gray-900">₹{(ORDER.taxMinor / 100).toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between pt-2 border-t border-gray-100">
              <Text className="text-xl font-bold text-gray-900">Grand Total</Text>
              <Text className="text-xl font-bold text-blue-600">₹{(ORDER.totalMinor / 100).toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Split Options */}
        <Text className="text-lg font-bold mb-3 text-gray-900">Payment Type</Text>
        <View className="flex-row gap-2 mb-6">
          {['FULL', 'EQUAL', 'AMOUNT', 'ITEM'].map(type => (
            <TouchableOpacity 
              key={type}
              onPress={() => setSplitType(type as any)}
              className={`px-4 py-2 rounded-xl border ${splitType === type ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}
            >
              <Text className={`font-semibold ${splitType === type ? 'text-blue-700' : 'text-gray-600'}`}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Methods */}
        <Text className="text-lg font-bold mb-3 text-gray-900">Payment Method</Text>
        <View className="flex-row flex-wrap gap-3 mb-6">
          {['CASH', 'RAZORPAY', 'UPI', 'CARD'].map(m => (
            <TouchableOpacity 
              key={m}
              onPress={() => setMethod(m as any)}
              className={`p-4 rounded-xl border w-[48%] items-center ${method === m ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}
            >
              <Text className={`font-bold ${method === m ? 'text-white' : 'text-gray-800'}`}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Cash Input */}
        {method === 'CASH' && (
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
            <Text className="text-gray-700 font-bold mb-2">Amount Received (₹)</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-lg"
              keyboardType="numeric"
              placeholder="0.00"
              value={receivedAmount}
              onChangeText={setReceivedAmount}
            />
            {receivedAmount && parseFloat(receivedAmount) >= amountToPay && (
              <Text className="text-green-600 font-bold mt-2 text-lg text-center">
                Change: ₹{(parseFloat(receivedAmount) - amountToPay).toFixed(2)}
              </Text>
            )}
          </View>
        )}

      </ScrollView>
      
      {/* Bottom Action */}
      <View className="p-4 bg-white border-t border-gray-100 pb-8">
        <TouchableOpacity 
          className="bg-blue-600 p-4 rounded-xl items-center shadow-sm"
          onPress={handlePayment}
        >
          <Text className="text-white font-bold text-xl">
            {method === 'CASH' ? 'Confirm Payment' : 'Process Payment'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
