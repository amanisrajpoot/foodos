import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../../../services/api';

export default function DriverProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [driver, setDriver] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  async function fetchProfile() {
    setLoading(true);
    try {
      const res = await api.get(`/v1/delivery/drivers/${id}`);
      setDriver(res.data);
    } catch (err) {
      console.log('Failed to fetch driver profile, using mock data');
      setDriver({
        id,
        name: 'Rahul Verma',
        phone: '+919876543210',
        email: 'rahul.v@foodos.app',
        licenseNumber: 'DL-1420110012345',
        vehicleType: 'BIKE',
        vehicleNumber: 'MH01AB1234',
        status: 'AVAILABLE',
        kycStatus: 'VERIFIED',
        deliveryAssignments: [
          { id: 'asgn-101', order: { orderNumber: '1001' }, status: 'DELIVERED', createdAt: new Date().toISOString() },
        ],
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(newStatus: string) {
    try {
      await api.patch(`/v1/delivery/drivers/${id}/status`, { status: newStatus });
      setDriver((prev: any) => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.log('Status update error', err);
      setDriver((prev: any) => ({ ...prev, status: newStatus }));
    }
  }

  async function verifyKyc(kycStatus: 'VERIFIED' | 'REJECTED') {
    try {
      await api.patch(`/v1/delivery/drivers/${id}/kyc`, { kycStatus });
      setDriver((prev: any) => ({ ...prev, kycStatus }));
    } catch (err) {
      console.log('KYC verify error', err);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4 sm:p-8">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-3xl font-bold text-slate-800">{driver?.name}</Text>
          <Text className="text-slate-500 font-mono">ID: {id}</Text>
        </View>
        <View className="flex-row gap-2">
          {driver?.kycStatus === 'PENDING' && (
            <TouchableOpacity
              className="bg-emerald-600 px-4 py-2 rounded-xl"
              onPress={() => verifyKyc('VERIFIED')}
            >
              <Text className="text-white font-semibold text-xs">Approve KYC</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Driver Information Card */}
      <View className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <Text className="text-xl font-bold text-slate-800 mb-4">Driver Profile & Vehicle Info</Text>

        <View className="space-y-4">
          <View className="flex-row gap-6">
            <View className="flex-1">
              <Text className="text-slate-500 text-xs font-semibold uppercase mb-1">Phone Number</Text>
              <Text className="text-slate-800 font-medium text-base">{driver?.phone}</Text>
            </View>

            <View className="flex-1">
              <Text className="text-slate-500 text-xs font-semibold uppercase mb-1">Email</Text>
              <Text className="text-slate-800 font-medium text-base">{driver?.email || 'N/A'}</Text>
            </View>
          </View>

          <View className="flex-row gap-6">
            <View className="flex-1">
              <Text className="text-slate-500 text-xs font-semibold uppercase mb-1">Vehicle Type & Plate</Text>
              <Text className="text-slate-800 font-medium text-base">{driver?.vehicleType} ({driver?.vehicleNumber || 'N/A'})</Text>
            </View>

            <View className="flex-1">
              <Text className="text-slate-500 text-xs font-semibold uppercase mb-1">License Number</Text>
              <Text className="text-slate-800 font-mono text-base">{driver?.licenseNumber || 'N/A'}</Text>
            </View>
          </View>

          {/* Duty Control */}
          <View className="pt-4 border-t border-slate-100">
            <Text className="text-slate-500 text-xs font-semibold uppercase mb-2">Duty Shift Status</Text>
            <View className="flex-row gap-2">
              {['AVAILABLE', 'ON_BREAK', 'INACTIVE'].map(st => (
                <TouchableOpacity
                  key={st}
                  className={`px-4 py-2 rounded-xl border ${driver?.status === st ? 'bg-indigo-600 border-indigo-600' : 'bg-slate-100 border-slate-200'}`}
                  onPress={() => updateStatus(st)}
                >
                  <Text className={`text-xs font-bold ${driver?.status === st ? 'text-white' : 'text-slate-700'}`}>
                    {st.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
