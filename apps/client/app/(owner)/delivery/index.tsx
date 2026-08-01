import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../../services/api';
import { Ionicons } from '@expo/vector-icons';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useAuthStore } from '../../../stores/auth.store';

export default function ActiveDeliveriesScreen() {
  const router = useRouter();
  const organizationId = useAuthStore(state => state.organizationId);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  // Manual Dispatch Modal state
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

  useEffect(() => {
    fetchActiveDeliveries();
    fetchAvailableDrivers();
  }, []);

  async function fetchActiveDeliveries() {
    setLoading(true);
    setError(false);
    try {
      if (!organizationId) throw new Error('No Organization ID');
      const restRes = await api.get(`/v1/restaurants/orgs/${organizationId}/restaurants`);
      let activeBranchId = 'branch-1';
      if (restRes.data && restRes.data.length > 0) {
        const res = await api.get(`/v1/restaurants/${restRes.data[0].id}/branches`);
        if (res.data && res.data.length > 0) {
          activeBranchId = res.data[0].id;
        }
      }
      const res = await api.get(`/v1/delivery/active?branchId=${activeBranchId}`);
      setDeliveries(res.data || []);
    } catch (error) {
      console.error('Failed to fetch active deliveries:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAvailableDrivers() {
    try {
      const branchId = 'branch-1';
      const res = await api.get(`/v1/delivery/drivers?branchId=${branchId}&status=AVAILABLE`);
      setDrivers(res.data || []);
    } catch (err) {
      console.error('Failed to fetch available drivers:', err);
      setDrivers([]);
    }
  }

  async function handleAssignDriver(driverId: string) {
    if (!selectedAssignmentId) return;
    try {
      await api.post(`/v1/delivery/assignments/${selectedAssignmentId}/assign`, { driverId });
      setDispatchModalOpen(false);
      setSelectedAssignmentId(null);
      fetchActiveDeliveries();
    } catch (err) {
      console.log('Assign driver error', err);
    }
  }

  async function handleUpdateStatus(assignmentId: string, status: string) {
    try {
      await api.patch(`/v1/delivery/assignments/${assignmentId}/status`, { status });
      fetchActiveDeliveries();
    } catch (err) {
      console.log('Status update error', err);
    }
  }

  const filteredDeliveries = deliveries.filter(d => {
    if (selectedFilter === 'ALL') return true;
    return d.status === selectedFilter;
  });

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-sm font-medium text-slate-400 mt-4">Loading Deliveries...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-950 p-6 sm:p-8">
        <ErrorState onRetry={fetchActiveDeliveries} />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-950 p-6 sm:p-8">
      {/* Header & Nav */}
      <View className="flex-row justify-between items-center mb-8 flex-wrap gap-4">
        <View>
          <Text className="text-3xl font-extrabold text-white tracking-tight">Delivery Control Tower</Text>
          <Text className="text-slate-400 text-sm mt-1">Real-time dispatch and active delivery order fulfillment</Text>
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity
            className="bg-slate-800 border border-slate-700 hover:bg-slate-700 px-5 py-3 rounded-xl flex-row items-center gap-2"
            onPress={() => router.push('/(owner)/delivery/drivers')}
          >
            <Ionicons name="bicycle-outline" size={16} color="#e2e8f0" />
            <Text className="text-slate-200 font-bold text-xs">Drivers Roster</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-indigo-600 hover:bg-indigo-500 px-5 py-3 rounded-xl shadow-lg shadow-indigo-600/30 flex-row items-center gap-2"
            onPress={() => router.push('/(owner)/delivery/settings')}
          >
            <Ionicons name="settings-outline" size={16} color="#ffffff" />
            <Text className="text-white font-bold text-xs">Partner Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Sub-bar */}
      <View className="flex-row gap-2 mb-8 flex-wrap">
        {['ALL', 'PENDING', 'ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].map(st => (
          <TouchableOpacity
            key={st}
            className={`px-4 py-2 rounded-xl border ${selectedFilter === st ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-600/25' : 'bg-slate-900 border-slate-800'}`}
            onPress={() => setSelectedFilter(st)}
          >
            <Text className={`text-xs font-bold tracking-wider ${selectedFilter === st ? 'text-white' : 'text-slate-400'}`}>
              {st.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Active Deliveries List */}
      {filteredDeliveries.length === 0 ? (
        <EmptyState 
          icon="cube-outline" 
          title="No Active Deliveries" 
          description="No delivery orders currently in fulfillment matching selected filter."
        />
      ) : (
        <View className="flex-row flex-wrap gap-6">
          {filteredDeliveries.map(item => (
            <View key={item.id} className="bg-slate-900 p-6 rounded-[1.5rem] border border-slate-800 shadow-xl min-w-[340px] flex-1">
              <View className="flex-row justify-between items-start mb-4">
                <View className="flex-row items-center gap-3">
                  <View className="bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl">
                    <Text className="font-extrabold text-indigo-400 text-sm">Order #{item.order?.orderNumber}</Text>
                  </View>
                  <Text className="text-white font-extrabold text-lg">{item.order?.customer?.fullName || 'Customer'}</Text>
                </View>
                <View className={`px-3 py-1 rounded-full border ${item.status === 'PENDING' ? 'bg-amber-500/10 border-amber-500/30' : item.status === 'DELIVERED' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-indigo-500/10 border-indigo-500/30'}`}>
                  <Text className={`text-[10px] font-extrabold tracking-wider ${item.status === 'PENDING' ? 'text-amber-400' : item.status === 'DELIVERED' ? 'text-emerald-400' : 'text-indigo-400'}`}>
                    {item.status}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-2 mb-3">
                <Ionicons name="location-outline" size={16} color="#94a3b8" />
                <Text className="text-slate-300 text-sm">{item.customerAddress?.addressLine1 || 'Delivery Address'}</Text>
              </View>
              
              {item.driver ? (
                <View className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4 flex-row justify-between items-center">
                  <View>
                    <Text className="text-xs font-bold text-slate-300 mb-0.5 flex-row items-center">🛵 {item.driver.name}</Text>
                    <Text className="text-[11px] text-slate-500 font-mono">{item.driver.phone}</Text>
                  </View>
                  <View className="bg-slate-900 px-2.5 py-1 rounded-md border border-slate-700">
                    <Text className="text-[10px] text-indigo-400 font-extrabold uppercase">{item.provider}</Text>
                  </View>
                </View>
              ) : (
                <View className="bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 mb-4 flex-row justify-between items-center">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="warning-outline" size={16} color="#f43f5e" />
                    <Text className="text-xs font-extrabold text-rose-400">Driver Not Assigned</Text>
                  </View>
                  <TouchableOpacity
                    className="bg-rose-500 px-4 py-2 rounded-lg shadow-lg shadow-rose-500/30"
                    onPress={() => {
                      setSelectedAssignmentId(item.id);
                      setDispatchModalOpen(true);
                    }}
                  >
                    <Text className="text-white text-xs font-bold">Dispatch Now</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Status Advancement Buttons */}
              <View className="flex-row justify-end gap-3 pt-4 border-t border-slate-800/80">
                {item.status === 'ASSIGNED' && (
                  <TouchableOpacity
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl flex-row items-center gap-1.5 shadow-lg shadow-blue-600/30"
                    onPress={() => handleUpdateStatus(item.id, 'PICKED_UP')}
                  >
                    <Ionicons name="cube-outline" size={16} color="#ffffff" />
                    <Text className="text-white text-xs font-bold">Mark Picked Up</Text>
                  </TouchableOpacity>
                )}
                {item.status === 'PICKED_UP' && (
                  <TouchableOpacity
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl flex-row items-center gap-1.5 shadow-lg shadow-indigo-600/30"
                    onPress={() => handleUpdateStatus(item.id, 'OUT_FOR_DELIVERY')}
                  >
                    <Ionicons name="bicycle-outline" size={16} color="#ffffff" />
                    <Text className="text-white text-xs font-bold">Out for Delivery</Text>
                  </TouchableOpacity>
                )}
                {item.status === 'OUT_FOR_DELIVERY' && (
                  <TouchableOpacity
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl flex-row items-center gap-1.5 shadow-lg shadow-emerald-600/30"
                    onPress={() => handleUpdateStatus(item.id, 'DELIVERED')}
                  >
                    <Ionicons name="checkmark-circle-outline" size={16} color="#ffffff" />
                    <Text className="text-white text-xs font-extrabold">Complete Delivery</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Manual Driver Dispatch Modal */}
      <Modal visible={dispatchModalOpen} transparent animationType="fade">
        <View className="flex-1 bg-slate-950/80 justify-center items-center p-4">
          <View className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl max-w-md w-full">
            <Text className="text-xl font-extrabold text-white mb-2">Select Driver for Dispatch</Text>
            <Text className="text-slate-400 text-xs mb-6">Assign an available local fleet driver to this delivery order.</Text>

            {drivers.length === 0 ? (
              <View className="bg-slate-950 border border-slate-800 p-6 rounded-xl items-center mb-6">
                <Ionicons name="sad-outline" size={24} color="#64748b" />
                <Text className="text-slate-400 font-bold text-sm mt-2">No Available Drivers</Text>
              </View>
            ) : (
              <View className="space-y-3 mb-6">
                {drivers.map(drv => (
                  <TouchableOpacity
                    key={drv.id}
                    className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-indigo-500/50 flex-row justify-between items-center"
                    onPress={() => handleAssignDriver(drv.id)}
                  >
                    <View>
                      <Text className="font-bold text-slate-200 text-sm">{drv.name}</Text>
                      <Text className="text-xs text-slate-500 font-mono mt-0.5">{drv.phone}</Text>
                    </View>
                    <View className="bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 flex-row items-center gap-1">
                      <Text className="text-xs font-bold text-indigo-400 uppercase">Assign</Text>
                      <Ionicons name="chevron-forward" size={14} color="#818cf8" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TouchableOpacity
              className="bg-slate-800 hover:bg-slate-700 p-4 rounded-xl items-center"
              onPress={() => {
                setDispatchModalOpen(false);
                setSelectedAssignmentId(null);
              }}
            >
              <Text className="text-white font-bold text-sm">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
