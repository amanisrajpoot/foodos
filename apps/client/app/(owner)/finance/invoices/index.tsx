import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../../../services/api';
import { ErrorState } from '../../../../components/ui/ErrorState';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { useAuthStore } from '../../../../stores/auth.store';

export default function InvoicesScreen() {
  const router = useRouter();
  const organizationId = useAuthStore(state => state.organizationId);
  const [search, setSearch] = useState('');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    setLoading(true);
    setError(false);
    try {
      if (!organizationId) throw new Error('No Organization ID');
      const res = await api.get(`/v1/finance/orgs/${organizationId}/invoices`);
      setInvoices(res.data || []);
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) || 
    inv.order?.orderNumber?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-sm font-medium text-slate-400 mt-4">Loading Invoices...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-950 p-6 sm:p-8">
        <ErrorState onRetry={fetchInvoices} />
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
            <Text className="text-2xl font-extrabold text-white tracking-tight">Invoices</Text>
            <Text className="text-slate-400 text-sm mt-0.5">Manage billing and generated invoices</Text>
          </View>
        </View>
        <View className="bg-slate-950 flex-row items-center px-4 py-2.5 rounded-xl border border-slate-800 shadow-inner">
          <Ionicons name="search" size={18} color="#64748b" />
          <TextInput 
            className="ml-2 w-48 text-slate-100 placeholder:text-slate-500 font-medium text-sm outline-none"
            placeholder="Search invoice or order..."
            placeholderTextColor="#64748b"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView className="p-6 sm:p-8">
        {filteredInvoices.length === 0 ? (
          <EmptyState 
            icon="document-text-outline" 
            title="No Invoices Found" 
            description={search ? "No invoices match your search criteria." : "There are no invoices generated yet."}
          />
        ) : (
          <View className="bg-slate-900 rounded-[1.5rem] shadow-xl border border-slate-800 overflow-hidden mb-12">
            {/* Header */}
            <View className="flex-row border-b border-slate-800 bg-slate-950/50 p-5">
              <Text className="flex-2 font-bold text-slate-400 text-xs uppercase tracking-wider">Invoice #</Text>
              <Text className="flex-1 font-bold text-slate-400 text-xs uppercase tracking-wider">Order #</Text>
              <Text className="flex-1 font-bold text-slate-400 text-xs uppercase tracking-wider">Date</Text>
              <Text className="flex-1 font-bold text-slate-400 text-xs uppercase tracking-wider text-right">Amount</Text>
              <Text className="flex-1 font-bold text-slate-400 text-xs uppercase tracking-wider text-center">Status</Text>
              <Text className="w-24 font-bold text-slate-400 text-xs uppercase tracking-wider text-center">Action</Text>
            </View>

            {/* List */}
            {filteredInvoices.map((inv, idx) => (
              <View key={inv.id} className={`flex-row p-5 items-center ${idx !== filteredInvoices.length - 1 ? 'border-b border-slate-800/60' : ''}`}>
                <Text className="flex-2 font-extrabold text-white">{inv.invoiceNumber}</Text>
                <Text className="flex-1 font-mono text-slate-300 text-sm">{inv.order?.orderNumber || 'N/A'}</Text>
                <Text className="flex-1 text-slate-500 text-sm font-medium">{new Date(inv.createdAt).toLocaleDateString()}</Text>
                <Text className="flex-1 font-extrabold text-indigo-400 text-right text-base">${((inv.totalMinor || 0) / 100).toFixed(2)}</Text>
                <View className="flex-1 items-center">
                  <View className={`px-3 py-1.5 rounded-md border ${
                    inv.status === 'ISSUED' ? 'bg-emerald-500/10 border-emerald-500/30' : 
                    inv.status === 'PAID' ? 'bg-indigo-500/10 border-indigo-500/30' : 
                    inv.status === 'VOIDED' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-slate-800 border-slate-700'
                  }`}>
                    <Text className={`text-[10px] uppercase tracking-wider font-extrabold ${
                      inv.status === 'ISSUED' ? 'text-emerald-400' : 
                      inv.status === 'PAID' ? 'text-indigo-400' : 
                      inv.status === 'VOIDED' ? 'text-rose-400' : 'text-slate-300'
                    }`}>{inv.status}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  className="w-24 items-center bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 py-2.5 rounded-xl transition-all"
                  onPress={() => router.push(`/(owner)/finance/invoices/${inv.id}`)}
                >
                  <Text className="text-indigo-400 font-bold text-xs uppercase tracking-wider">View</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
