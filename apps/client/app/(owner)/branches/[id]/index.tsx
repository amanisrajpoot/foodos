import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Switch, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../../../services/api';
import { Ionicons } from '@expo/vector-icons';
import { ErrorState } from '../../../../components/ui/ErrorState';

export default function BranchControlPanelScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [branch, setBranch] = useState<any>(null);
  const [dineIn, setDineIn] = useState(true);
  const [takeaway, setTakeaway] = useState(true);
  const [delivery, setDelivery] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);
  const [prepMinutes, setPrepMinutes] = useState('15');

  useEffect(() => {
    fetchBranch();
  }, [id]);

  async function fetchBranch() {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get(`/v1/restaurants/branches/${id}`);
      setBranch(res.data);
      if (res.data?.settings) {
        setDineIn(res.data.settings.acceptsDineIn);
        setTakeaway(res.data.settings.acceptsTakeaway);
        setDelivery(res.data.settings.acceptsDelivery);
        setAutoAccept(res.data.settings.autoAcceptOrders);
        setPrepMinutes(String(res.data.settings.defaultPreparationMinutes || 15));
      }
    } catch (err) {
      console.error('Failed to fetch branch:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    try {
      const organizationId = '00000000-0000-0000-0000-000000000000';
      await api.put(`/v1/restaurants/branches/${id}/settings`, {
        organizationId,
        acceptsDineIn: dineIn,
        acceptsTakeaway: takeaway,
        acceptsDelivery: delivery,
        autoAcceptOrders: autoAccept,
        defaultPreparationMinutes: parseInt(prepMinutes, 10) || 15,
      });
      alert('Branch settings updated successfully!');
    } catch (err) {
      console.log('Save settings error', err);
    }
  }

  async function toggleBranchStatus() {
    try {
      const newStatus = branch.status === 'ACTIVE' ? 'TEMPORARILY_CLOSED' : 'ACTIVE';
      await api.patch(`/v1/restaurants/branches/${id}`, { status: newStatus });
      setBranch((prev: any) => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.log('Toggle status error', err);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-sm font-medium text-slate-400 mt-4">Loading Branch Details...</Text>
      </View>
    );
  }

  if (error || !branch) {
    return (
      <View className="flex-1 bg-slate-950 p-6 sm:p-8">
        <ErrorState onRetry={fetchBranch} />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-950 p-6 sm:p-8">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8 flex-wrap gap-4">
        <View>
          <View className="flex-row items-center gap-3 mb-1">
            <Text className="text-3xl font-extrabold text-white tracking-tight">{branch?.name}</Text>
            <View className={`px-3 py-1 rounded-full border ${branch?.status === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
              <Text className={`text-xs font-extrabold ${branch?.status === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {branch?.status}
              </Text>
            </View>
          </View>
          <Text className="text-slate-500 font-mono">CODE: {branch?.branchCode} • TYPE: {branch?.branchType}</Text>
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity
            className={`px-5 py-3 rounded-xl flex-row items-center gap-2 transition-colors ${branch?.status === 'ACTIVE' ? 'bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20' : 'bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20'}`}
            onPress={toggleBranchStatus}
          >
            <Ionicons name={branch?.status === 'ACTIVE' ? 'pause-circle-outline' : 'play-circle-outline'} size={18} color={branch?.status === 'ACTIVE' ? '#fb7185' : '#34d399'} />
            <Text className={`font-bold text-xs ${branch?.status === 'ACTIVE' ? 'text-rose-400' : 'text-emerald-400'}`}>
              {branch?.status === 'ACTIVE' ? 'Pause Branch' : 'Activate Branch'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-indigo-600 hover:bg-indigo-500 px-5 py-3 rounded-xl flex-row items-center gap-2 shadow-lg shadow-indigo-600/30"
            onPress={() => router.push(`/(owner)/branches/${id}/tables` as any)}
          >
            <Ionicons name="apps-outline" size={18} color="#ffffff" />
            <Text className="text-white font-bold text-xs">Floorplan</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-6 mb-8">
        {/* Address & Info Card */}
        <View className="flex-1 min-w-[300px] bg-slate-900 p-6 rounded-[1.5rem] border border-slate-800 shadow-xl">
          <Text className="text-xl font-extrabold text-white mb-6 flex-row items-center">📍 Location Details</Text>
          <View className="space-y-4">
            <View className="flex-row items-start gap-3">
              <View className="mt-1"><Ionicons name="map-outline" size={18} color="#94a3b8" /></View>
              <View>
                <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Address</Text>
                <Text className="text-slate-300 text-sm leading-relaxed">{branch?.addressLine1}, {branch?.city}, {branch?.state} {branch?.postalCode}</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-3">
              <View><Ionicons name="call-outline" size={18} color="#94a3b8" /></View>
              <View>
                <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Phone</Text>
                <Text className="text-slate-300 text-sm">{branch?.phone || 'N/A'}</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-3">
              <View><Ionicons name="mail-outline" size={18} color="#94a3b8" /></View>
              <View>
                <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</Text>
                <Text className="text-slate-300 text-sm">{branch?.email || 'N/A'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Channel & Operational Settings Card */}
        <View className="flex-1 min-w-[340px] bg-slate-900 p-6 rounded-[1.5rem] border border-slate-800 shadow-xl">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-extrabold text-white">⚙️ Operations</Text>
            <TouchableOpacity className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl flex-row items-center gap-2" onPress={saveSettings}>
              <Ionicons name="save-outline" size={16} color="#ffffff" />
              <Text className="text-white font-bold text-xs">Save</Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-5">
            <View className="flex-row justify-between items-center pb-4 border-b border-slate-800/80">
              <View className="flex-1 pr-4">
                <Text className="font-bold text-slate-200 mb-1">Accept Dine-In Orders</Text>
                <Text className="text-[11px] text-slate-500 leading-relaxed">Enable POS & table QR ordering channels</Text>
              </View>
              <Switch value={dineIn} onValueChange={setDineIn} trackColor={{ false: '#334155', true: '#4f46e5' }} thumbColor="#ffffff" />
            </View>

            <View className="flex-row justify-between items-center pb-4 border-b border-slate-800/80">
              <View className="flex-1 pr-4">
                <Text className="font-bold text-slate-200 mb-1">Accept Takeaway / Pickup</Text>
                <Text className="text-[11px] text-slate-500 leading-relaxed">Allow customer pickup order channel</Text>
              </View>
              <Switch value={takeaway} onValueChange={setTakeaway} trackColor={{ false: '#334155', true: '#4f46e5' }} thumbColor="#ffffff" />
            </View>

            <View className="flex-row justify-between items-center pb-4 border-b border-slate-800/80">
              <View className="flex-1 pr-4">
                <Text className="font-bold text-slate-200 mb-1">Accept Delivery Orders</Text>
                <Text className="text-[11px] text-slate-500 leading-relaxed">Enable local fleet and 3P courier dispatch</Text>
              </View>
              <Switch value={delivery} onValueChange={setDelivery} trackColor={{ false: '#334155', true: '#4f46e5' }} thumbColor="#ffffff" />
            </View>

            <View className="flex-row justify-between items-center pb-4 border-b border-slate-800/80">
              <View className="flex-1 pr-4">
                <Text className="font-bold text-slate-200 mb-1">Auto-Accept Incoming Orders</Text>
                <Text className="text-[11px] text-slate-500 leading-relaxed">Bypass manual staff acceptance and push to KDS directly</Text>
              </View>
              <Switch value={autoAccept} onValueChange={setAutoAccept} trackColor={{ false: '#334155', true: '#4f46e5' }} thumbColor="#ffffff" />
            </View>

            <View className="pt-2">
              <Text className="font-bold text-slate-300 mb-2">Default Prep Time (Minutes)</Text>
              <View className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 max-w-[140px] flex-row items-center gap-2">
                <Ionicons name="time-outline" size={18} color="#94a3b8" />
                <TextInput
                  className="flex-1 text-slate-100 font-bold text-base outline-none"
                  value={prepMinutes}
                  onChangeText={setPrepMinutes}
                  keyboardType="number-pad"
                  placeholderTextColor="#64748b"
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
