import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../../services/api';
import { Ionicons } from '@expo/vector-icons';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useAuthStore } from '../../../stores/auth.store';

export default function OwnerOrdersFeed() {
  const router = useRouter();
  const organizationId = useAuthStore(state => state.organizationId);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    setError(false);
    try {
      if (!organizationId) throw new Error('No Organization ID');
      const restRes = await api.get(`/v1/restaurants/orgs/${organizationId}/restaurants`);
      let activeBranchId = 'branch-1';
      if (restRes.data && restRes.data.length > 0) {
        const branchRes = await api.get(`/v1/restaurants/${restRes.data[0].id}/branches`);
        if (branchRes.data && branchRes.data.length > 0) {
          activeBranchId = branchRes.data[0].id;
        }
      }
      const res = await api.get(`/v1/orders?branchId=${activeBranchId}`);
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-slate-800 border-slate-700 text-slate-300';
      case 'DELIVERED': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'IN_KITCHEN': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'PLACED': return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'READY': return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400';
      case 'CANCELLED': return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
      default: return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-sm font-medium text-slate-400 mt-4">Loading Live Feed...</Text>
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
    <View className="flex-1 bg-slate-950 p-6 sm:p-8">
      <View className="mb-8">
        <Text className="text-3xl font-extrabold text-white tracking-tight mb-2">Live Order Feed</Text>
        <Text className="text-slate-400 text-sm">Monitoring real-time POS, Kiosk, and Delivery orders</Text>
      </View>
      
      {orders.length === 0 ? (
        <EmptyState 
          icon="receipt-outline" 
          title="No Orders Found" 
          description="Waiting for new orders to arrive from your active channels."
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => {
            const statusStyle = getStatusStyle(item.status);
            const statusBg = statusStyle.split(' ').filter(c => c.startsWith('bg-') || c.startsWith('border-')).join(' ');
            const statusText = statusStyle.split(' ').find(c => c.startsWith('text-')) || 'text-slate-300';

            return (
              <TouchableOpacity 
                className="bg-slate-900 p-5 rounded-[1.5rem] mb-4 shadow-xl border border-slate-800 hover:border-indigo-500/50 flex-row justify-between items-center transition-all"
                onPress={() => router.push(`/(owner)/orders/${item.id}`)}
              >
                <View className="flex-1 pr-4">
                  <View className="flex-row items-center gap-2 mb-1.5">
                    <Text className="font-extrabold text-lg text-white">{item.orderNumber}</Text>
                    {item.customer && (
                      <View className="bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                        <Text className="text-[10px] text-slate-300">{item.customer.fullName || item.customer.phone}</Text>
                      </View>
                    )}
                  </View>
                  <View className="flex-row items-center gap-2 flex-wrap">
                    <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider">{item.channel?.replace('_', ' ') || 'UNKNOWN'}</Text>
                    <Text className="text-slate-700 text-xs">•</Text>
                    <Text className="text-indigo-400 font-extrabold text-sm">${((item.totalMinor || 0) / 100).toFixed(2)}</Text>
                    <Text className="text-slate-700 text-xs">•</Text>
                    <Text className="text-slate-500 text-xs">{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  </View>
                </View>
                <View className={`px-3 py-1.5 rounded-full border ${statusBg}`}>
                  <Text className={`font-extrabold text-[10px] uppercase tracking-wider ${statusText}`}>
                    {item.status.replace('_', ' ')}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}
