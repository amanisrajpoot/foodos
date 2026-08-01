import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../../../services/api';
import { ErrorState } from '../../../../components/ui/ErrorState';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { useAuthStore } from '../../../../stores/auth.store';

export default function PaymentsLogScreen() {
  const router = useRouter();
  const organizationId = useAuthStore(state => state.organizationId);
  const [search, setSearch] = useState('');
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    setLoading(true);
    setError(false);
    try {
      if (!organizationId) throw new Error('No Organization ID');
      const res = await api.get(`/v1/payments/organization/${organizationId}`);
      setPayments(res.data || []);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const filteredPayments = payments.filter(p => 
    p.paymentNumber?.toLowerCase().includes(search.toLowerCase()) || 
    p.order?.orderNumber?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-sm font-medium text-slate-400 mt-4">Loading Payments...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-950 p-6 sm:p-8">
        <ErrorState onRetry={fetchPayments} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-950">
      <View className="p-6 bg-slate-900 border-b border-slate-800 flex-row justify-between items-center z-10 shadow-xl">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-all">
            <Ionicons name="arrow-back" size={20} color="#cbd5e1" />
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-extrabold text-white tracking-tight">Payments Log</Text>
            <Text className="text-slate-400 text-sm mt-0.5">Track all payment transactions across branches</Text>
          </View>
        </View>
        <View className="bg-slate-950 flex-row items-center px-4 py-2.5 rounded-xl border border-slate-800 shadow-inner">
          <Ionicons name="search" size={18} color="#64748b" />
          <TextInput 
            className="ml-2 w-48 text-slate-100 placeholder:text-slate-500 font-medium text-sm outline-none"
            placeholder="Search by Payment/Order ID..."
            placeholderTextColor="#64748b"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView className="p-6 sm:p-8">
        {filteredPayments.length === 0 ? (
          <EmptyState 
            icon="wallet-outline" 
            title="No Payments Found" 
            description={search ? "No payments match your search criteria." : "There are no payment transactions to show."}
          />
        ) : (
          <View className="bg-slate-900 rounded-[1.5rem] shadow-xl border border-slate-800 overflow-hidden mb-12">
            {/* Header */}
            <View className="flex-row border-b border-slate-800 bg-slate-950/50 p-5">
              <Text className="flex-2 font-bold text-slate-400 text-xs uppercase tracking-wider">Payment ID</Text>
              <Text className="flex-1 font-bold text-slate-400 text-xs uppercase tracking-wider">Order #</Text>
              <Text className="flex-1 font-bold text-slate-400 text-xs uppercase tracking-wider">Method</Text>
              <Text className="flex-2 font-bold text-slate-400 text-xs uppercase tracking-wider">Date & Time</Text>
              <Text className="flex-1 font-bold text-slate-400 text-xs uppercase tracking-wider text-right">Amount</Text>
              <Text className="flex-1 font-bold text-slate-400 text-xs uppercase tracking-wider text-center">Status</Text>
            </View>

            {/* List */}
            {filteredPayments.map((pay, idx) => (
              <View key={pay.id} className={`flex-row p-5 items-center ${idx !== filteredPayments.length - 1 ? 'border-b border-slate-800/60' : ''}`}>
                <Text className="flex-2 font-extrabold text-white">{pay.paymentNumber}</Text>
                <Text className="flex-1 font-mono text-slate-300 text-sm">{pay.order?.orderNumber || 'N/A'}</Text>
                <Text className="flex-1 font-bold text-indigo-400 text-sm uppercase">{pay.paymentMethod}</Text>
                <Text className="flex-2 text-slate-500 text-sm font-medium">{new Date(pay.createdAt).toLocaleString()}</Text>
                <Text className="flex-1 font-extrabold text-emerald-400 text-right text-base">${((pay.amountMinor || 0) / 100).toFixed(2)}</Text>
                <View className="flex-1 items-center">
                  <View className={`px-3 py-1.5 rounded-md border ${
                    pay.status === 'CAPTURED' ? 'bg-emerald-500/10 border-emerald-500/30' : 
                    pay.status === 'FAILED' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-amber-500/10 border-amber-500/30'
                  }`}>
                    <Text className={`text-[10px] uppercase tracking-wider font-extrabold ${
                      pay.status === 'CAPTURED' ? 'text-emerald-400' : 
                      pay.status === 'FAILED' ? 'text-rose-400' : 'text-amber-400'
                    }`}>{pay.status}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
