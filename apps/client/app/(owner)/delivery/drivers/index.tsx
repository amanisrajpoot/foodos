import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../../../services/api';
import { Ionicons } from '@expo/vector-icons';
import { ErrorState } from '../../../../components/ui/ErrorState';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { useAuthStore } from '../../../../stores/auth.store';

export default function DriversRosterScreen() {
  const router = useRouter();
  const organizationId = useAuthStore(state => state.organizationId);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchDrivers();
  }, []);

  async function fetchDrivers() {
    setLoading(true);
    setError(false);
    try {
      if (!organizationId) throw new Error('No Organization ID');
      const restRes = await api.get(`/restaurants/orgs/${organizationId}/restaurants`);
      let activeBranchId = 'branch-1';
      if (restRes.data && restRes.data.length > 0) {
        const branchRes = await api.get(`/restaurants/${restRes.data[0].id}/branches`);
        if (branchRes.data && branchRes.data.length > 0) {
          activeBranchId = branchRes.data[0].id;
        }
      }
      const res = await api.get(`/delivery/drivers?branchId=${activeBranchId}`);
      setDrivers(res.data || []);
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-sm font-medium text-slate-400 mt-4">Loading Driver Roster...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-950 p-6 sm:p-8">
        <ErrorState onRetry={fetchDrivers} />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-950 p-6 sm:p-8">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8 flex-wrap gap-4">
        <View>
          <Text className="text-3xl font-extrabold text-white tracking-tight">Local Fleet Driver Roster</Text>
          <Text className="text-slate-400 text-sm mt-1">Manage local branch delivery partners and fleet duty status</Text>
        </View>

        <TouchableOpacity
          className="bg-indigo-600 hover:bg-indigo-500 px-5 py-3 rounded-xl shadow-lg shadow-indigo-600/30 flex-row items-center gap-2"
          onPress={() => router.push('/(owner)/delivery/drivers/onboard')}
        >
          <Ionicons name="person-add-outline" size={16} color="#ffffff" />
          <Text className="text-white font-bold text-xs">Onboard Driver</Text>
        </TouchableOpacity>
      </View>

      {drivers.length === 0 ? (
        <EmptyState 
          icon="bicycle-outline" 
          title="No Drivers Onboarded" 
          description="Onboard your first local fleet driver to begin fulfilling delivery orders."
          actionLabel="Onboard Driver"
          onAction={() => router.push('/(owner)/delivery/drivers/onboard')}
        />
      ) : (
        <View className="flex-row flex-wrap gap-6">
          {drivers.map(item => (
            <TouchableOpacity
              key={item.id}
              className="bg-slate-900 p-6 rounded-[1.5rem] border border-slate-800 shadow-xl min-w-[320px] flex-1 hover:border-indigo-500/50 transition-all"
              onPress={() => router.push(`/(owner)/delivery/drivers/${item.id}` as any)}
            >
              <View className="flex-row justify-between items-start mb-4">
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-full items-center justify-center">
                    <Text className="text-xl font-extrabold text-indigo-400">{item.name.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text className="font-extrabold text-white text-lg">{item.name}</Text>
                    <Text className="text-xs text-slate-400 font-mono mt-0.5">{item.phone}</Text>
                  </View>
                </View>
                <View className={`px-3 py-1 rounded-full border ${item.status === 'AVAILABLE' ? 'bg-emerald-500/10 border-emerald-500/30' : item.status === 'ASSIGNED' ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                  <Text className={`text-[10px] font-extrabold tracking-wider uppercase ${item.status === 'AVAILABLE' ? 'text-emerald-400' : item.status === 'ASSIGNED' ? 'text-indigo-400' : 'text-amber-400'}`}>
                    {item.status}
                  </Text>
                </View>
              </View>

              <View className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4 flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="bicycle-outline" size={16} color="#94a3b8" />
                  <Text className="text-xs font-bold text-slate-300">{item.vehicleType} <Text className="font-mono text-slate-500">({item.vehicleNumber || 'No Plate'})</Text></Text>
                </View>
                <View className={`px-2 py-0.5 rounded border ${item.kycStatus === 'VERIFIED' ? 'bg-emerald-950 border-emerald-900' : 'bg-amber-950 border-amber-900'}`}>
                  <Text className={`text-[10px] font-bold ${item.kycStatus === 'VERIFIED' ? 'text-emerald-500' : 'text-amber-500'}`}>KYC: {item.kycStatus || 'VERIFIED'}</Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center pt-4 border-t border-slate-800/80">
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="cube-outline" size={14} color="#64748b" />
                  <Text className="text-xs text-slate-400 font-medium">
                    Active Tasks: <Text className="text-white font-bold">{item.deliveryAssignments?.length || 0}</Text>
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Text className="text-indigo-400 text-xs font-bold">Profile & History</Text>
                  <Ionicons name="arrow-forward" size={14} color="#818cf8" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
