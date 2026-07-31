import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../../services/api';

export default function ActiveDeliveriesScreen() {
  const router = useRouter();
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    try {
      const branchId = 'branch-1';
      const res = await api.get(`/v1/delivery/active?branchId=${branchId}`);
      setDeliveries(res.data || []);
    } catch (error) {
      console.log('Failed to fetch active deliveries, using mock data');
      setDeliveries([
        {
          id: 'asgn-1',
          order: { orderNumber: '1001', totalMinor: 85000, customer: { fullName: 'Amit Kumar' } },
          status: 'PENDING',
          provider: 'LOCAL_FLEET',
          customerAddress: { addressLine1: '402 Sunset Towers, Bandra' },
          driver: null,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'asgn-2',
          order: { orderNumber: '1002', totalMinor: 45000, customer: { fullName: 'Priya Sharma' } },
          status: 'OUT_FOR_DELIVERY',
          provider: 'LOCAL_FLEET',
          customerAddress: { addressLine1: '12 Green Park, Juhu' },
          driver: { name: 'Rahul Verma', phone: '+919876543210' },
          createdAt: new Date().toISOString(),
        },
      ]);
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
      setDrivers([
        { id: 'driver-1', name: 'Rahul Verma', phone: '+919876543210', status: 'AVAILABLE' },
        { id: 'driver-2', name: 'Suresh Patil', phone: '+919876543215', status: 'AVAILABLE' },
      ]);
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

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4 sm:p-8">
      {/* Header & Nav */}
      <View className="flex-row justify-between items-center mb-6 flex-wrap gap-4">
        <View>
          <Text className="text-3xl font-bold text-slate-800">Delivery Control Tower</Text>
          <Text className="text-slate-500 text-sm">Real-time dispatch and active delivery order fulfillment</Text>
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity
            className="bg-slate-200 px-4 py-2 rounded-xl"
            onPress={() => router.push('/(owner)/delivery/drivers')}
          >
            <Text className="text-slate-800 font-semibold text-xs">🛵 Drivers Roster</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-indigo-600 px-4 py-2 rounded-xl"
            onPress={() => router.push('/(owner)/delivery/settings')}
          >
            <Text className="text-white font-semibold text-xs">⚙️ Partner Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Sub-bar */}
      <View className="flex-row gap-2 mb-6">
        {['ALL', 'PENDING', 'ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].map(st => (
          <TouchableOpacity
            key={st}
            className={`px-3 py-1.5 rounded-xl border ${selectedFilter === st ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-200'}`}
            onPress={() => setSelectedFilter(st)}
          >
            <Text className={`text-xs font-semibold ${selectedFilter === st ? 'text-white' : 'text-slate-600'}`}>
              {st.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Active Deliveries List */}
      {loading ? (
        <ActivityIndicator className="mt-10" size="large" />
      ) : filteredDeliveries.length === 0 ? (
        <View className="bg-white p-12 rounded-2xl border border-slate-200 items-center justify-center">
          <Text className="text-4xl mb-2">📦</Text>
          <Text className="text-slate-700 font-semibold text-lg mb-1">No Active Deliveries</Text>
          <Text className="text-slate-400 text-sm">No delivery orders currently in fulfillment matching selected filter.</Text>
        </View>
      ) : (
        <View className="space-y-4">
          {filteredDeliveries.map(item => (
            <View key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center gap-3">
                  <View className="bg-indigo-100 px-3 py-1 rounded-xl">
                    <Text className="font-bold text-indigo-700 text-sm">Order #{item.order?.orderNumber}</Text>
                  </View>
                  <Text className="text-slate-800 font-bold text-base">{item.order?.customer?.fullName || 'Customer'}</Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${item.status === 'PENDING' ? 'bg-amber-100' : item.status === 'DELIVERED' ? 'bg-emerald-100' : 'bg-indigo-100'}`}>
                  <Text className={`text-xs font-bold ${item.status === 'PENDING' ? 'text-amber-800' : item.status === 'DELIVERED' ? 'text-emerald-800' : 'text-indigo-800'}`}>
                    {item.status}
                  </Text>
                </View>
              </View>

              <Text className="text-slate-600 text-sm mb-2">📍 {item.customerAddress?.addressLine1 || 'Delivery Address'}</Text>
              
              {item.driver ? (
                <View className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3 flex-row justify-between items-center">
                  <Text className="text-xs font-semibold text-slate-700">🛵 Assigned Driver: {item.driver.name} ({item.driver.phone})</Text>
                  <Text className="text-xs text-indigo-600 font-mono">Provider: {item.provider}</Text>
                </View>
              ) : (
                <View className="bg-amber-50 p-3 rounded-xl border border-amber-100 mb-3 flex-row justify-between items-center">
                  <Text className="text-xs font-semibold text-amber-800">⚠️ Driver Not Assigned Yet</Text>
                  <TouchableOpacity
                    className="bg-amber-600 px-3 py-1 rounded-lg"
                    onPress={() => {
                      setSelectedAssignmentId(item.id);
                      setDispatchModalOpen(true);
                    }}
                  >
                    <Text className="text-white text-xs font-bold">Dispatch Driver</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Status Advancement Buttons */}
              <View className="flex-row justify-end gap-2 pt-2 border-t border-slate-100">
                {item.status === 'ASSIGNED' && (
                  <TouchableOpacity
                    className="px-3 py-1.5 bg-blue-600 rounded-lg"
                    onPress={() => handleUpdateStatus(item.id, 'PICKED_UP')}
                  >
                    <Text className="text-white text-xs font-medium">Mark Picked Up</Text>
                  </TouchableOpacity>
                )}
                {item.status === 'PICKED_UP' && (
                  <TouchableOpacity
                    className="px-3 py-1.5 bg-indigo-600 rounded-lg"
                    onPress={() => handleUpdateStatus(item.id, 'OUT_FOR_DELIVERY')}
                  >
                    <Text className="text-white text-xs font-medium">Mark Out for Delivery</Text>
                  </TouchableOpacity>
                )}
                {item.status === 'OUT_FOR_DELIVERY' && (
                  <TouchableOpacity
                    className="px-3 py-1.5 bg-emerald-600 rounded-lg"
                    onPress={() => handleUpdateStatus(item.id, 'DELIVERED')}
                  >
                    <Text className="text-white text-xs font-bold">✓ Complete Delivery</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Manual Driver Dispatch Modal */}
      <Modal visible={dispatchModalOpen} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white p-6 rounded-2xl max-w-md w-full">
            <Text className="text-xl font-bold text-slate-800 mb-2">Select Driver for Dispatch</Text>
            <Text className="text-slate-500 text-xs mb-4">Assign an available local fleet driver to this delivery order.</Text>

            {drivers.length === 0 ? (
              <Text className="text-slate-400 italic py-4">No drivers currently AVAILABLE for dispatch.</Text>
            ) : (
              <View className="space-y-2 mb-4">
                {drivers.map(drv => (
                  <TouchableOpacity
                    key={drv.id}
                    className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex-row justify-between items-center"
                    onPress={() => handleAssignDriver(drv.id)}
                  >
                    <Text className="font-semibold text-slate-800 text-sm">{drv.name} ({drv.phone})</Text>
                    <Text className="text-xs font-bold text-indigo-600">Assign →</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TouchableOpacity
              className="bg-slate-200 p-3 rounded-xl items-center"
              onPress={() => {
                setDispatchModalOpen(false);
                setSelectedAssignmentId(null);
              }}
            >
              <Text className="text-slate-700 font-semibold text-sm">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
