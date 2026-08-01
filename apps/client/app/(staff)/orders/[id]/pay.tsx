import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../../../services/api';
import { ErrorState } from '../../../../components/ui/ErrorState';
import { Ionicons } from '@expo/vector-icons';

export default function PayOrderScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [order, setOrder] = useState<any>(null);

  const [method, setMethod] = useState<'CASH' | 'RAZORPAY' | 'UPI' | 'CARD' | null>('UPI');
  const [splitType, setSplitType] = useState<'FULL' | 'EQUAL' | 'AMOUNT' | 'ITEM'>('FULL');
  
  // Cash handling
  const [receivedAmount, setReceivedAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  async function fetchOrder() {
    if (!id) return;
    setLoading(true);
    setError(false);
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error('Failed to fetch order for payment:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const handlePayment = async () => {
    if (!order) return;
    if (!method) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }
    
    const amountToPay = (order.totalMinor || 0) / 100;

    if (method === 'CASH') {
      const received = parseFloat(receivedAmount);
      if (isNaN(received) || received < amountToPay) {
        Alert.alert('Error', 'Insufficient amount received');
        return;
      }
      const change = received - amountToPay;
      completeOrderPayment(`Payment recorded. Change to return: ₹${change.toFixed(2)}`);
    } else {
      completeOrderPayment(`Payment captured successfully via ${method}.`);
    }
  };

  const completeOrderPayment = async (successMessage: string) => {
    setProcessing(true);
    try {
      await api.patch(`/orders/${id}/complete`);
      Alert.alert('Success', successMessage, [
        { text: 'Print Receipt', onPress: () => router.push('/(staff)/orders') }
      ]);
    } catch (err) {
      console.error('Failed to complete order:', err);
      Alert.alert('Error', 'Failed to process payment with server.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-sm font-medium text-slate-400 mt-4">Loading Payment Details...</Text>
      </View>
    );
  }

  if (error || !order) {
    return (
      <View className="flex-1 bg-slate-950 p-6 sm:p-8">
        <ErrorState onRetry={fetchOrder} />
      </View>
    );
  }

  const amountToPay = (order.totalMinor || 0) / 100;
  const subtotal = (order.subtotalMinor || 0) / 100;
  // Simulating tax since we don't store it separately yet in V1 model
  const tax = amountToPay - subtotal; 

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      <View className="p-6 bg-slate-900 border-b border-slate-800 flex-row items-center justify-between shadow-xl z-10">
        <View>
          <Text className="text-3xl font-extrabold text-white tracking-tight">Checkout</Text>
          <Text className="text-slate-400 font-bold uppercase tracking-wider text-xs mt-1">
            Order {order.orderNumber} • {order.table?.label ? `Table ${order.table.label}` : order.channel.replace('_', ' ')}
          </Text>
        </View>
        <TouchableOpacity 
          className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl border border-slate-700 transition-all"
          onPress={() => router.back()}
        >
          <Text className="text-white font-extrabold tracking-wider uppercase text-xs">Cancel</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="p-6">
        {/* Bill Preview */}
        <View className="bg-slate-900 rounded-[1.5rem] p-6 shadow-xl border border-slate-800 mb-8">
          <Text className="text-xl font-extrabold mb-5 text-white border-b border-slate-800/80 pb-4 tracking-tight">Bill Summary</Text>
          {order.items?.map((item: any) => (
            <View key={item.id} className="flex-row justify-between mb-3">
              <Text className="text-slate-300 font-bold">{item.quantity}x {item.nameSnapshot}</Text>
              <Text className="text-white font-extrabold">₹{((item.lineTotalMinor || 0) / 100).toFixed(2)}</Text>
            </View>
          ))}
          <View className="border-t border-slate-800/80 mt-4 pt-4 space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-slate-400 font-bold uppercase tracking-wider text-xs">Subtotal</Text>
              <Text className="text-slate-200 font-bold text-sm">₹{subtotal.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-slate-400 font-bold uppercase tracking-wider text-xs">Taxes & Fees</Text>
              <Text className="text-slate-200 font-bold text-sm">₹{tax.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between pt-4 border-t border-slate-800 mt-2">
              <Text className="text-xl font-extrabold text-white tracking-tight">Grand Total</Text>
              <Text className="text-2xl font-black text-amber-400 tracking-tight">₹{amountToPay.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Split Options */}
        <Text className="text-lg font-extrabold mb-4 text-white tracking-tight">Payment Type</Text>
        <View className="flex-row gap-3 mb-8">
          {['FULL', 'EQUAL', 'AMOUNT', 'ITEM'].map(type => (
            <TouchableOpacity 
              key={type}
              onPress={() => setSplitType(type as any)}
              className={`px-5 py-2.5 rounded-xl border transition-all ${
                splitType === type 
                  ? 'bg-amber-500/20 border-amber-500 shadow-lg shadow-amber-500/10' 
                  : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Text className={`text-xs font-extrabold uppercase tracking-wider ${splitType === type ? 'text-amber-400' : 'text-slate-400'}`}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Methods */}
        <Text className="text-lg font-extrabold mb-4 text-white tracking-tight">Payment Method</Text>
        <View className="flex-row flex-wrap gap-4 mb-8">
          {(['CASH', 'RAZORPAY', 'UPI', 'CARD'] as const).map(m => (
            <TouchableOpacity 
              key={m}
              onPress={() => setMethod(m as any)}
              className={`p-5 rounded-[1.5rem] border w-[47%] items-center transition-all ${
                method === m 
                  ? 'bg-amber-500/10 border-amber-500 shadow-xl shadow-amber-500/20' 
                  : 'bg-slate-900 border-slate-800 hover:bg-slate-800/80'
              }`}
            >
              <Ionicons 
                name={
                  m === 'UPI' ? 'qr-code-outline' :
                  m === 'CARD' ? 'card-outline' :
                  m === 'RAZORPAY' ? 'globe-outline' : 'cash-outline'
                } 
                size={28} 
                color={method === m ? '#f59e0b' : '#64748b'} 
                className="mb-2"
              />
              <Text className={`text-xs mt-2 font-extrabold uppercase tracking-widest ${method === m ? 'text-amber-400' : 'text-slate-400'}`}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Cash Input */}
        {method === 'CASH' && (
          <View className="bg-slate-900 rounded-[1.5rem] p-6 shadow-xl border border-slate-800 mb-8">
            <Text className="text-slate-400 font-extrabold uppercase tracking-wider text-xs mb-3">Amount Received (₹)</Text>
            <TextInput
              className="bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl p-4 text-xl font-bold text-white shadow-inner transition-all"
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor="#475569"
              value={receivedAmount}
              onChangeText={setReceivedAmount}
            />
            {receivedAmount && parseFloat(receivedAmount) >= amountToPay && (
              <View className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl mt-4 flex-row items-center justify-between">
                <Text className="text-emerald-400 font-bold uppercase tracking-wider text-xs">Change Due</Text>
                <Text className="text-emerald-400 font-black text-xl">
                  ₹{(parseFloat(receivedAmount) - amountToPay).toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        )}

      </ScrollView>
      
      {/* Bottom Action */}
      <View className="p-6 bg-slate-900 border-t border-slate-800 pb-10">
        <TouchableOpacity 
          className={`bg-emerald-500 hover:bg-emerald-400 p-5 rounded-[1.5rem] items-center shadow-lg shadow-emerald-500/25 transition-all ${processing ? 'opacity-70' : ''}`}
          onPress={handlePayment}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Text className="text-slate-950 font-black text-base uppercase tracking-wider">
              {method === 'CASH' ? 'Confirm Payment ✓' : 'Process Payment ✓'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
