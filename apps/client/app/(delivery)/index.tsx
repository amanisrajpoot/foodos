import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Switch, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuthStore } from '../../stores/auth.store';
import { api } from '../../services/api';
import { ErrorState } from '../../components/ui/ErrorState';
import { ToastOverlay, useToastStore } from '../../components/ui/ToastOverlay';

export default function DeliveryPartnerHubScreen() {
  const router = useRouter();
  const { branchId, user } = useAuthStore();
  const showToast = useToastStore((s: any) => s.showToast);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    fetchAssignments();
  }, [branchId]);

  const fetchAssignments = async () => {
    if (!branchId) return;
    try {
      setError(false);
      const res = await api.get(`/delivery/active?branchId=${branchId}`);
      setAssignments(res.data || []);
    } catch (err) {
      console.error('Failed to fetch assignments', err);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAssignments();
  };

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    let nextStatus = 'PICKED_UP';
    if (currentStatus === 'PICKED_UP') nextStatus = 'OUT_FOR_DELIVERY';
    if (currentStatus === 'OUT_FOR_DELIVERY') nextStatus = 'DELIVERED';

    try {
      await api.patch(`/delivery/assignments/${id}/status`, { status: nextStatus });
      showToast('success', `Status updated to ${nextStatus.replace(/_/g, ' ')}`);
      
      if (nextStatus === 'DELIVERED') {
        setAssignments((prev) => prev.filter((a) => a.id !== id));
      } else {
        setAssignments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a))
        );
      }
    } catch (err) {
      console.error('Failed to update status', err);
      showToast('error', 'Failed to update assignment status');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="text-slate-400 mt-4 font-bold tracking-widest uppercase text-xs">Syncing Dispatch...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-950 p-6 sm:p-8">
        <ErrorState onRetry={fetchAssignments} />
      </View>
    );
  }

  const getButtonText = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'ASSIGNED': return 'Confirm Pickup ✓';
      case 'PICKED_UP': return 'Start Delivery →';
      case 'OUT_FOR_DELIVERY': return 'Mark Delivered ✓';
      default: return 'Update Status';
    }
  };

  return (
    <ScrollView 
      className="flex-1 bg-slate-950 p-4 sm:p-8"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />}
    >
      <ToastOverlay />

      {/* Header */}
      <View className="flex-row justify-between items-center mb-8 flex-wrap gap-4 bg-slate-900 p-5 rounded-[1.5rem] border border-slate-800 shadow-xl">
        <View className="flex-row items-center space-x-4">
          <View className="w-14 h-14 bg-emerald-500/10 rounded-2xl items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
            <Ionicons name="bicycle" size={32} color="#10b981" />
          </View>
          <View>
            <Text className="text-3xl font-black text-white tracking-tight">
              Driver Hub
            </Text>
            <Text className="text-slate-400 font-bold tracking-widest uppercase text-[10px] mt-1">
              Code DRV-{user?.id?.slice(-4) || '902'} • Live Dispatch
            </Text>
          </View>
        </View>

        {/* Duty Toggle Card */}
        <View className="bg-slate-950 border border-slate-800 px-5 py-3 rounded-xl flex-row items-center space-x-4 shadow-inner">
          <View className="items-end">
            <Text className="text-xs font-black text-white uppercase tracking-wider">
              {isOnDuty ? 'ONLINE & ON DUTY' : 'OFF DUTY'}
            </Text>
            <Text className="text-[10px] text-emerald-400 font-bold mt-0.5 tracking-wider">Auto-dispatch {isOnDuty ? 'Active' : 'Paused'}</Text>
          </View>
          <Switch value={isOnDuty} onValueChange={setIsOnDuty} trackColor={{ true: '#10b981', false: '#334155' }} thumbColor="#f8fafc" />
        </View>
      </View>

      {/* Driver Daily Stats Row */}
      <View className="flex-row flex-wrap gap-4 mb-8">
        <StatCard
          title="Today's Earnings"
          value="₹1,240"
          change="+₹320 tip"
          isPositive={true}
          iconName="wallet-outline"
          iconColor="#10b981"
          subtitle="9 deliveries completed"
        />
        <StatCard
          title="Active Orders"
          value={assignments.length}
          change="On track"
          isPositive={true}
          iconName="navigate-outline"
          iconColor="#f59e0b"
          subtitle="In delivery queue"
        />
        <StatCard
          title="Driver Rating"
          value="4.95 ⭐"
          change="Top 5%"
          isPositive={true}
          iconName="star-outline"
          iconColor="#a855f7"
          subtitle="Based on 140 ratings"
        />
      </View>

      {/* Active Assignments Queue */}
      <View className="mb-6 flex-row justify-between items-center px-1">
        <Text className="text-xl font-black text-white tracking-tight">Active Dispatches</Text>
        <TouchableOpacity
          onPress={fetchAssignments}
          className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl hover:bg-slate-800 transition-all shadow-sm"
        >
          <Text className="text-xs font-bold text-slate-300 uppercase tracking-wider">Sync Now</Text>
        </TouchableOpacity>
      </View>

      {assignments.length === 0 ? (
        <View className="bg-slate-900 border border-slate-800 rounded-[1.5rem] py-16 items-center shadow-xl">
          <Ionicons name="checkmark-done-circle-outline" size={56} color="#10b981" style={{ opacity: 0.8 }} />
          <Text className="text-xl font-black text-white mt-4 tracking-tight">All Deliveries Complete!</Text>
          <Text className="text-slate-400 font-bold text-xs mt-2 text-center px-8 leading-5">
            You are currently online. Stay nearby to receive new auto-dispatches.
          </Text>
        </View>
      ) : (
        <View className="gap-5">
          {assignments.map((item) => (
            <TouchableOpacity 
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-[1.5rem] p-5 shadow-2xl transition-all hover:border-emerald-500/50"
              onPress={() => router.push(`/(delivery)/${item.id}`)}
            >
              <View className="flex-row justify-between items-center mb-4 flex-wrap gap-2">
                <View className="flex-row items-center space-x-3">
                  <View className={`px-3 py-1 rounded-md border ${
                    item.status === 'ASSIGNED' || item.status === 'PENDING' ? 'bg-amber-500/10 border-amber-500/30' :
                    item.status === 'PICKED_UP' ? 'bg-blue-500/10 border-blue-500/30' :
                    'bg-emerald-500/10 border-emerald-500/30'
                  }`}>
                    <Text className={`text-[10px] font-black uppercase tracking-widest ${
                      item.status === 'ASSIGNED' || item.status === 'PENDING' ? 'text-amber-400' :
                      item.status === 'PICKED_UP' ? 'text-blue-400' :
                      'text-emerald-400'
                    }`}>
                      {item.status.replace(/_/g, ' ')}
                    </Text>
                  </View>
                  <Text className="text-2xl font-black text-white tracking-tighter">
                    {item.order?.orderNumber || 'Delivery'}
                  </Text>
                </View>
                <View className="bg-slate-950 border border-slate-800 px-4 py-1.5 rounded-xl shadow-inner">
                  <Text className="text-xs font-black text-emerald-400 tracking-wider">Payout: ₹{Math.floor(Math.random() * 50) + 40}</Text>
                </View>
              </View>

              {/* Pickup & Drop Details */}
              <View className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 gap-4 mb-5 shadow-inner">
                <View className="flex-row items-start space-x-4">
                  <View className="w-8 h-8 rounded-full bg-amber-500/10 items-center justify-center border border-amber-500/20">
                    <Ionicons name="storefront" size={16} color="#f59e0b" />
                  </View>
                  <View className="flex-1 pt-1">
                    <Text className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pickup From</Text>
                    <Text className="text-base font-bold text-white mt-0.5">{item.branch?.name || 'Restaurant Name'}</Text>
                    <Text className="text-xs text-slate-400 mt-1 font-medium">{item.branch?.address || 'Restaurant Address'}</Text>
                  </View>
                </View>

                <View className="border-t border-slate-800/80 pt-4 flex-row items-start space-x-4">
                  <View className="w-8 h-8 rounded-full bg-emerald-500/10 items-center justify-center border border-emerald-500/20">
                    <Ionicons name="location" size={16} color="#10b981" />
                  </View>
                  <View className="flex-1 pt-1">
                    <Text className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dropoff To</Text>
                    <Text className="text-base font-bold text-white mt-0.5">
                      {item.order?.customer?.name || 'Customer'}
                    </Text>
                    <Text className="text-xs text-slate-400 mt-1 font-medium">{item.customerAddress?.addressLine1 || 'Customer Address'}</Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row justify-between items-center flex-wrap gap-4">
                <View className="flex-row items-center space-x-4 px-1">
                  <View className="flex-row items-center">
                    <Ionicons name="navigate-circle-outline" size={16} color="#64748b" style={{ marginRight: 4 }} />
                    <Text className="text-xs font-bold text-slate-400">3.4 km</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={16} color="#64748b" style={{ marginRight: 4 }} />
                    <Text className="text-xs font-bold text-slate-400">18 mins</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation(); // Prevents navigating to details if they click the button directly
                    handleUpdateStatus(item.id, item.status);
                  }}
                  className={`px-6 py-3 rounded-xl shadow-lg border transition-all ${
                    item.status === 'ASSIGNED' || item.status === 'PENDING' ? 'bg-amber-500/20 border-amber-500/50 hover:bg-amber-500/30' :
                    item.status === 'PICKED_UP' ? 'bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30' :
                    'bg-emerald-500/20 border-emerald-500/50 hover:bg-emerald-500/30'
                  }`}
                >
                  <Text className={`font-black uppercase text-xs tracking-wider ${
                    item.status === 'ASSIGNED' || item.status === 'PENDING' ? 'text-amber-400' :
                    item.status === 'PICKED_UP' ? 'text-blue-400' :
                    'text-emerald-400'
                  }`}>
                    {getButtonText(item.status)}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
