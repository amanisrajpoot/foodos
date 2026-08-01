import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { api } from '../../../../services/api';
import { ErrorState } from '../../../../components/ui/ErrorState';
import { Ionicons } from '@expo/vector-icons';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [order, setOrder] = useState<any>(null);
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
      console.error('Failed to fetch order detail:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const markCompleted = async () => {
    setProcessing(true);
    try {
      await api.patch(`/orders/${id}/complete`);
      Alert.alert('Success', 'Order marked as completed.');
      fetchOrder();
    } catch (err) {
      console.error('Failed to complete order:', err);
      Alert.alert('Error', 'Could not complete order.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-sm font-medium text-slate-400 mt-4">Loading Order...</Text>
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

  return (
    <View className="flex-1 bg-slate-950">
      <View className="p-6 bg-slate-900 border-b border-slate-800 flex-row items-center justify-between shadow-xl z-10">
        <View>
          <Text className="text-3xl font-extrabold text-white tracking-tight">{order.orderNumber}</Text>
          <View className="flex-row items-center mt-2 space-x-2">
            <Text className="text-slate-400 font-bold uppercase tracking-wider text-xs">
              {order.table?.label ? `Table ${order.table.label}` : order.channel.replace('_', ' ')}
            </Text>
            <Text className="text-slate-600 font-bold">•</Text>
            <Text className="text-amber-400 font-bold uppercase tracking-wider text-xs">{order.status.replace('_', ' ')}</Text>
          </View>
        </View>
        <TouchableOpacity 
          className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl border border-slate-700 transition-all"
          onPress={() => router.back()}
        >
          <Text className="text-white font-extrabold tracking-wider uppercase text-xs">Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="p-6">
        {/* Status Timeline */}
        <View className="bg-slate-900 rounded-[1.5rem] p-6 shadow-xl border border-slate-800 mb-8">
          <Text className="text-lg font-extrabold mb-5 text-white tracking-tight">Timeline</Text>
          <View className="flex-row">
            {['PLACED', 'ACCEPTED', 'IN_KITCHEN', 'READY', 'COMPLETED'].map((step, idx) => {
              // Basic mock logic for timeline progression
              const stepIndex = ['PLACED', 'ACCEPTED', 'IN_KITCHEN', 'READY', 'COMPLETED'].indexOf(step);
              const currentIndex = ['PLACED', 'ACCEPTED', 'IN_KITCHEN', 'READY', 'COMPLETED'].indexOf(order.status) || 0;
              const passed = stepIndex <= currentIndex;
              return (
                <View key={step} className="flex-1 items-center">
                  <View className={`w-4 h-4 rounded-full mb-2 ${passed ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-slate-800 border border-slate-700'}`} />
                  <Text className={`text-[10px] text-center font-extrabold uppercase tracking-widest ${passed ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {step.replace('_', ' ')}
                  </Text>
                </View>
              )
            })}
          </View>
        </View>

        {order.channel === 'DELIVERY' && order.delivery && (
          <View className="bg-slate-900 rounded-[1.5rem] p-6 shadow-xl border border-slate-800 mb-8">
            <Text className="text-xl font-extrabold mb-5 text-white border-b border-slate-800/80 pb-4 tracking-tight">Delivery Details</Text>
            <View className="flex-row justify-between mb-3">
              <Text className="text-slate-400 font-bold uppercase tracking-wider text-xs">Status</Text>
              <Text className="font-extrabold text-sm text-indigo-400">{order.delivery.status.replace('_', ' ')}</Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-slate-400 font-bold uppercase tracking-wider text-xs">Provider</Text>
              <Text className="font-extrabold text-sm text-slate-200">{order.delivery.provider}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-slate-400 font-bold uppercase tracking-wider text-xs">Driver</Text>
              <Text className="font-extrabold text-sm text-slate-200">{order.delivery.driverName || 'Unassigned'}</Text>
            </View>
          </View>
        )}

        <Text className="text-xl font-extrabold mb-4 text-white tracking-tight">Order Items</Text>
        <View className="bg-slate-900 rounded-[1.5rem] p-6 shadow-xl border border-slate-800 mb-8">
          {order.items?.map((item: any) => (
            <View key={item.id} className="flex-row justify-between items-center mb-5 border-b border-slate-800/80 pb-5 last:border-0 last:mb-0 last:pb-0">
              <View>
                <Text className="font-extrabold text-lg text-white">{item.nameSnapshot}</Text>
                <Text className="text-slate-400 mt-1 font-bold text-xs uppercase tracking-wider">Qty: {item.quantity}</Text>
              </View>
              <View className="items-end">
                <Text className="font-black text-amber-400">₹{((item.unitPriceMinor || 0) / 100).toFixed(2)}</Text>
              </View>
            </View>
          ))}
          <View className="pt-5 border-t border-slate-800 mt-2 flex-row justify-between items-center">
             <Text className="text-slate-400 font-extrabold text-sm uppercase tracking-wider">Total</Text>
             <Text className="font-black text-2xl text-white">₹{((order.totalMinor || 0) / 100).toFixed(2)}</Text>
          </View>
        </View>

        <View className="flex-row gap-4 pb-12">
          {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
            <TouchableOpacity 
              onPress={markCompleted}
              disabled={processing}
              className={`flex-1 bg-emerald-500 hover:bg-emerald-400 p-4 rounded-xl items-center shadow-lg shadow-emerald-500/25 transition-all ${processing ? 'opacity-70' : ''}`}
            >
              {processing ? (
                <ActivityIndicator color="#0f172a" />
              ) : (
                <Text className="text-slate-950 font-black text-sm uppercase tracking-wider">Mark Completed ✓</Text>
              )}
            </TouchableOpacity>
          )}
          <Link href={`/(staff)/orders/${id}/pay`} asChild>
            <TouchableOpacity className="flex-1 bg-amber-500 hover:bg-amber-400 p-4 rounded-xl items-center shadow-lg shadow-amber-500/25 transition-all">
              <Text className="text-slate-950 font-black text-sm uppercase tracking-wider">Pay / Settle</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}

