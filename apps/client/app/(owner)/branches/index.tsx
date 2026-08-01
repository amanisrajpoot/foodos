import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../../services/api';
import { useAuthStore } from '../../../stores/auth.store';
import { Ionicons } from '@expo/vector-icons';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';

export default function BranchDirectoryScreen() {
  const router = useRouter();
  const organizationId = useAuthStore(state => state.organizationId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);

  useEffect(() => {
    fetchBranches();
  }, []);

  async function fetchBranches() {
    setLoading(true);
    setError(false);
    try {
      // Fetch restaurants for org first, then branches of first restaurant (simple case)
      if (!organizationId) throw new Error('No Organization ID');
      const restRes = await api.get(`/restaurants/orgs/${organizationId}/restaurants`);
      if (restRes.data && restRes.data.length > 0) {
        const restaurantId = restRes.data[0].id;
        const res = await api.get(`/restaurants/${restaurantId}/branches`);
        setBranches(res.data || []);
      } else {
        setBranches([]);
      }
    } catch (err) {
      console.error('Failed to fetch branches:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-sm font-medium text-slate-400 mt-4">Loading Locations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-950 p-6 sm:p-8">
        <ErrorState onRetry={fetchBranches} />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-950 p-6 sm:p-8">
      <View className="flex-row justify-between items-center mb-8 flex-wrap gap-4">
        <View>
          <Text className="text-3xl font-extrabold text-white tracking-tight">Branch Locations</Text>
          <Text className="text-slate-400 text-sm mt-1">Manage physical, cloud kitchen, and virtual operating branches</Text>
        </View>

        <TouchableOpacity
          className="bg-indigo-600 hover:bg-indigo-500 px-5 py-3 rounded-xl shadow-lg shadow-indigo-600/30 flex-row items-center gap-2"
          onPress={() => router.push('/(onboarding)/create-branch')}
        >
          <Ionicons name="add" size={18} color="#ffffff" />
          <Text className="text-white font-bold text-sm">Add New Branch</Text>
        </TouchableOpacity>
      </View>

      {branches.length === 0 ? (
        <EmptyState 
          icon="business-outline" 
          title="No Branches Found" 
          description="You haven't set up any operating locations yet."
          actionLabel="Create Branch"
          onAction={() => router.push('/(onboarding)/create-branch')}
        />
      ) : (
        <View className="space-y-4">
          {branches.map(b => (
            <View key={b.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex-row justify-between items-center flex-wrap gap-4">
              <View className="flex-1 min-w-[240px]">
                <View className="flex-row items-center gap-3 mb-2">
                  <Text className="text-xl font-extrabold text-white">{b.name}</Text>
                  <View className={`px-2.5 py-0.5 rounded-lg border ${
                    b.status === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'
                  }`}>
                    <Text className={`text-[10px] font-extrabold ${
                      b.status === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>{b.status}</Text>
                  </View>
                </View>
                <Text className="text-xs text-slate-500 font-mono mb-3">CODE: {b.branchCode} • TYPE: {b.branchType}</Text>
                
                <View className="flex-row items-center gap-2 mb-1.5">
                  <Ionicons name="location-outline" size={14} color="#94a3b8" />
                  <Text className="text-sm text-slate-300">{b.addressLine1}, {b.city}</Text>
                </View>
                {b.phone && (
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="call-outline" size={14} color="#94a3b8" />
                    <Text className="text-sm text-slate-300">{b.phone}</Text>
                  </View>
                )}
              </View>

              <View className="flex-row gap-3 flex-wrap">
                <TouchableOpacity
                  className="px-5 py-3 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-colors flex-row items-center gap-2"
                  onPress={() => router.push(`/(owner)/branches/${b.id}/tables` as any)}
                >
                  <Ionicons name="apps-outline" size={16} color="#cbd5e1" />
                  <Text className="text-slate-200 text-xs font-bold">Floorplan</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="px-5 py-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl hover:bg-indigo-500/20 transition-colors flex-row items-center gap-2"
                  onPress={() => router.push(`/(owner)/branches/${b.id}` as any)}
                >
                  <Ionicons name="settings-outline" size={16} color="#818cf8" />
                  <Text className="text-indigo-400 text-xs font-bold">Manage</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
