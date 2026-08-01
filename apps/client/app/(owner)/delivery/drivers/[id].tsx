import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../../../services/api';
import { Ionicons } from '@expo/vector-icons';
import { ErrorState } from '../../../../components/ui/ErrorState';

export default function DriverProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [driver, setDriver] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  async function fetchProfile() {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get(`/v1/delivery/drivers/${id}`);
      setDriver(res.data);
    } catch (err) {
      console.error('Failed to fetch driver profile:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(newStatus: string) {
    try {
      await api.patch(`/v1/delivery/drivers/${id}/status`, { status: newStatus });
      setDriver((prev: any) => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error('Status update error', err);
    }
  }

  async function verifyKyc(kycStatus: 'VERIFIED' | 'REJECTED') {
    try {
      await api.patch(`/v1/delivery/drivers/${id}/kyc`, { kycStatus });
      setDriver((prev: any) => ({ ...prev, kycStatus }));
    } catch (err) {
      console.error('KYC verify error:', err);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-sm font-medium text-slate-400 mt-4">Loading Profile...</Text>
      </View>
    );
  }

  if (error || !driver) {
    return (
      <View className="flex-1 bg-slate-950 p-6 sm:p-8">
        <ErrorState onRetry={fetchProfile} />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-950 p-6 sm:p-8">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8 flex-wrap gap-4">
        <View className="flex-row items-center gap-4">
          <View className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-full items-center justify-center">
            <Text className="text-3xl font-extrabold text-indigo-400">{driver.name.charAt(0)}</Text>
          </View>
          <View>
            <Text className="text-3xl font-extrabold text-white tracking-tight">{driver.name}</Text>
            <Text className="text-slate-500 font-mono text-sm mt-1">ID: {id}</Text>
          </View>
        </View>
        <View className="flex-row gap-3">
          {driver?.kycStatus === 'PENDING' && (
            <TouchableOpacity
              className="bg-emerald-600 hover:bg-emerald-500 px-5 py-3 rounded-xl shadow-lg shadow-emerald-600/30 flex-row items-center gap-2"
              onPress={() => verifyKyc('VERIFIED')}
            >
              <Ionicons name="shield-checkmark-outline" size={16} color="#ffffff" />
              <Text className="text-white font-bold text-xs">Approve KYC</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Driver Information Card */}
      <View className="bg-slate-900 p-6 rounded-[1.5rem] border border-slate-800 shadow-xl mb-8">
        <View className="flex-row items-center gap-2 mb-6">
          <Ionicons name="person-outline" size={20} color="#f8fafc" />
          <Text className="text-xl font-extrabold text-white">Driver Profile & Vehicle Info</Text>
        </View>

        <View className="space-y-6">
          <View className="flex-row gap-6 flex-wrap">
            <View className="flex-1 min-w-[200px]">
              <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">Phone Number</Text>
              <Text className="text-slate-100 font-bold text-base font-mono">{driver?.phone}</Text>
            </View>

            <View className="flex-1 min-w-[200px]">
              <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">Email</Text>
              <Text className="text-slate-100 font-medium text-base">{driver?.email || 'N/A'}</Text>
            </View>
          </View>

          <View className="flex-row gap-6 flex-wrap">
            <View className="flex-1 min-w-[200px]">
              <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">Vehicle Type & Plate</Text>
              <View className="flex-row items-center gap-2">
                <Ionicons name="bicycle-outline" size={16} color="#cbd5e1" />
                <Text className="text-slate-100 font-bold text-base">{driver?.vehicleType} <Text className="font-mono text-slate-400">({driver?.vehicleNumber || 'N/A'})</Text></Text>
              </View>
            </View>

            <View className="flex-1 min-w-[200px]">
              <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">License Number</Text>
              <Text className="text-slate-100 font-mono font-medium text-base bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 self-start">{driver?.licenseNumber || 'N/A'}</Text>
            </View>
          </View>

          {/* Duty Control */}
          <View className="pt-6 border-t border-slate-800/80">
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">Duty Shift Status</Text>
            <View className="flex-row gap-3 flex-wrap">
              {['AVAILABLE', 'ON_BREAK', 'INACTIVE'].map(st => (
                <TouchableOpacity
                  key={st}
                  className={`px-5 py-2.5 rounded-xl border flex-row items-center gap-2 ${driver?.status === st ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-600/30' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
                  onPress={() => updateStatus(st)}
                >
                  <View className={`w-2 h-2 rounded-full ${st === 'AVAILABLE' ? 'bg-emerald-400' : st === 'ON_BREAK' ? 'bg-amber-400' : 'bg-slate-400'}`} />
                  <Text className={`text-xs font-bold tracking-wide ${driver?.status === st ? 'text-white' : 'text-slate-400'}`}>
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
