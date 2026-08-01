import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../../services/api';
import { useAuthStore } from '../../../stores/auth.store';
import { ErrorState } from '../../../components/ui/ErrorState';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState } from '../../../components/ui/EmptyState';

export default function ActiveOrdersScreen() {
  const router = useRouter();
  const { branchId } = useAuthStore();
  const [filter, setFilter] = useState('ALL');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, [branchId]);

  async function fetchOrders() {
    if (!branchId) return;
    setLoading(true);
    setError(false);
    try {
      const res = await api.get(`/v1/orders?branchId=${branchId}`);
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'IN_KITCHEN': return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'ACCEPTED': return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400';
      case 'COMPLETED': return 'bg-slate-800 border-slate-700 text-slate-400';
      default: return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  const filteredOrders = orders.filter(o => filter === 'ALL' || o.status === filter || o.channel === filter);

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-sm font-medium text-slate-400 mt-4">Loading Orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-950 p-6 sm:p-8">
        <ErrorState onRetry={fetchOrders} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-950">
      <View className="p-6 bg-slate-900 border-b border-slate-800 flex-row items-center justify-between shadow-xl z-10">
        <View>
          <Text className="text-3xl font-extrabold text-white tracking-tight">Active Orders</Text>
          <Text className="text-slate-400 text-sm mt-0.5">Manage live orders and dispatch</Text>
        </View>
        <TouchableOpacity 
          onPress={fetchOrders}
          className="bg-slate-800 p-2.5 rounded-full border border-slate-700"
        >
          <Ionicons name="refresh" size={20} color="#cbd5e1" />
        </TouchableOpacity>
      </View>
      
      <View className="p-6">
        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
          <View className="flex-row space-x-3">
            {['ALL', 'ACCEPTED', 'IN_KITCHEN', 'READY', 'DINE_IN', 'TAKEAWAY'].map(f => (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                className={`px-5 py-2 rounded-xl border transition-all ${
                  filter === f 
                    ? 'bg-amber-500/20 border-amber-500 shadow-lg shadow-amber-500/10' 
                    : 'bg-slate-900 border-slate-800 hover:bg-slate-800/80'
                }`}
              >
                <Text className={`text-xs font-extrabold tracking-wider uppercase ${
                  filter === f ? 'text-amber-400' : 'text-slate-400'
                }`}>
                  {f.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <FlatList
          data={filteredOrders}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              className="bg-slate-900 p-6 rounded-[1.5rem] mb-4 shadow-xl border border-slate-800 flex-row justify-between items-center hover:border-amber-500/50 transition-all"
              onPress={() => router.push(`/(staff)/orders/${item.id}`)}
            >
              <View>
                <Text className="font-extrabold text-xl text-white tracking-tight">{item.orderNumber}</Text>
                <View className="flex-row items-center mt-2 space-x-2">
                  <View className="bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                    <Text className="text-slate-300 text-xs font-bold uppercase tracking-wider">
                      {item.table?.label ? `Table ${item.table.label}` : item.channel.replace('_', ' ')}
                    </Text>
                  </View>
                  <Text className="text-slate-600 font-bold">•</Text>
                  <Text className="text-amber-400 font-extrabold">₹{((item.totalMinor || 0) / 100).toFixed(2)}</Text>
                </View>
              </View>
              <View className={`px-4 py-2 rounded-xl border ${getStatusColor(item.status)}`}>
                <Text className={`font-extrabold text-xs uppercase tracking-widest ${getStatusColor(item.status)}`}>
                  {item.status.replace('_', ' ')}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View className="mt-8">
              <EmptyState 
                icon="receipt-outline" 
                title="No active orders" 
                description={`There are no orders matching "${filter}".`}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
}
