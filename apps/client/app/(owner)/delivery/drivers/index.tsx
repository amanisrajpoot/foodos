import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../../../services/api';

export default function DriversRosterScreen() {
  const router = useRouter();
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrivers();
  }, []);

  async function fetchDrivers() {
    setLoading(true);
    try {
      const branchId = 'branch-1';
      const res = await api.get(`/v1/delivery/drivers?branchId=${branchId}`);
      setDrivers(res.data || []);
    } catch (error) {
      console.log('Failed to fetch drivers, using mock roster');
      setDrivers([
        {
          id: 'driver-1',
          name: 'Rahul Verma',
          phone: '+919876543210',
          vehicleType: 'BIKE',
          vehicleNumber: 'MH01AB1234',
          status: 'AVAILABLE',
          kycStatus: 'VERIFIED',
          deliveryAssignments: [],
        },
        {
          id: 'driver-2',
          name: 'Vikram Singh',
          phone: '+919876543211',
          vehicleType: 'SCOOTER',
          vehicleNumber: 'MH02CD5678',
          status: 'ASSIGNED',
          kycStatus: 'VERIFIED',
          deliveryAssignments: [{ id: 'asgn-1' }],
        },
        {
          id: 'driver-3',
          name: 'Amit Patel',
          phone: '+919876543212',
          vehicleType: 'BIKE',
          vehicleNumber: 'MH03EF9012',
          status: 'ON_BREAK',
          kycStatus: 'PENDING',
          deliveryAssignments: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4 sm:p-8">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6 flex-wrap gap-4">
        <View>
          <Text className="text-3xl font-bold text-slate-800">Local Fleet Driver Roster</Text>
          <Text className="text-slate-500 text-sm">Manage local branch delivery partners and fleet duty status</Text>
        </View>

        <TouchableOpacity
          className="bg-indigo-600 px-4 py-2.5 rounded-xl shadow-sm"
          onPress={() => router.push('/(owner)/delivery/drivers/onboard')}
        >
          <Text className="text-white font-semibold text-sm">+ Onboard Driver</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator className="mt-10" size="large" />
      ) : drivers.length === 0 ? (
        <View className="bg-white p-12 rounded-2xl border border-slate-200 items-center justify-center">
          <Text className="text-4xl mb-2">🛵</Text>
          <Text className="text-slate-700 font-semibold text-lg mb-1">No Drivers Onboarded</Text>
          <Text className="text-slate-400 text-sm">Onboard your first local fleet driver to begin fulfilling delivery orders.</Text>
        </View>
      ) : (
        <View className="flex-row flex-wrap gap-4">
          {drivers.map(item => (
            <TouchableOpacity
              key={item.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-w-[280px] flex-1"
              onPress={() => router.push(`/(owner)/delivery/drivers/${item.id}` as any)}
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 bg-indigo-100 rounded-full items-center justify-center">
                    <Text className="text-lg font-bold text-indigo-700">{item.name.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text className="font-bold text-slate-800 text-base">{item.name}</Text>
                    <Text className="text-xs text-slate-500">{item.phone}</Text>
                  </View>
                </View>
                <View className={`px-2.5 py-0.5 rounded-full ${item.status === 'AVAILABLE' ? 'bg-emerald-100' : item.status === 'ASSIGNED' ? 'bg-indigo-100' : 'bg-amber-100'}`}>
                  <Text className={`text-xs font-bold ${item.status === 'AVAILABLE' ? 'text-emerald-800' : item.status === 'ASSIGNED' ? 'text-indigo-800' : 'text-amber-800'}`}>
                    {item.status}
                  </Text>
                </View>
              </View>

              <View className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3 flex-row justify-between items-center">
                <Text className="text-xs font-medium text-slate-600">🛵 {item.vehicleType} ({item.vehicleNumber || 'No Plate'})</Text>
                <Text className="text-xs font-bold text-slate-700">KYC: {item.kycStatus || 'VERIFIED'}</Text>
              </View>

              <View className="flex-row justify-between items-center pt-2 border-t border-slate-100">
                <Text className="text-xs text-slate-500 font-medium">
                  Active Tasks: {item.deliveryAssignments?.length || 0}
                </Text>
                <Text className="text-indigo-600 text-xs font-semibold">Profile & History →</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
