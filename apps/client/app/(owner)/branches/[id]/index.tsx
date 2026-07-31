import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Switch, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../../../services/api';

export default function BranchControlPanelScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
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
    try {
      const res = await api.get(`/restaurants/branches/${id}`);
      setBranch(res.data);
      if (res.data?.settings) {
        setDineIn(res.data.settings.acceptsDineIn);
        setTakeaway(res.data.settings.acceptsTakeaway);
        setDelivery(res.data.settings.acceptsDelivery);
        setAutoAccept(res.data.settings.autoAcceptOrders);
        setPrepMinutes(String(res.data.settings.defaultPreparationMinutes || 15));
      }
    } catch (err) {
      console.log('Failed to fetch branch, using mock data');
      const mock = {
        id,
        name: 'Downtown Main Branch',
        branchCode: 'BR-001',
        branchType: 'HYBRID',
        status: 'ACTIVE',
        phone: '+919876543210',
        email: 'downtown@restaurant.com',
        addressLine1: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        settings: {
          acceptsDineIn: true,
          acceptsTakeaway: true,
          acceptsDelivery: true,
          autoAcceptOrders: false,
          defaultPreparationMinutes: 15,
        },
      };
      setBranch(mock);
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    try {
      const organizationId = '00000000-0000-0000-0000-000000000000';
      await api.put(`/restaurants/branches/${id}/settings`, {
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
      await api.patch(`/restaurants/branches/${id}`, { status: newStatus });
      setBranch((prev: any) => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.log('Toggle status error', err);
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
      <View className="flex-row justify-between items-center mb-6 flex-wrap gap-4">
        <View>
          <View className="flex-row items-center gap-3">
            <Text className="text-3xl font-bold text-slate-800">{branch?.name}</Text>
            <View className={`px-3 py-1 rounded-full ${branch?.status === 'ACTIVE' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
              <Text className={`text-xs font-bold ${branch?.status === 'ACTIVE' ? 'text-emerald-800' : 'text-amber-800'}`}>
                {branch?.status}
              </Text>
            </View>
          </View>
          <Text className="text-slate-500 font-mono">Code: {branch?.branchCode} • {branch?.branchType}</Text>
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity
            className={`px-4 py-2 rounded-xl ${branch?.status === 'ACTIVE' ? 'bg-amber-600' : 'bg-emerald-600'}`}
            onPress={toggleBranchStatus}
          >
            <Text className="text-white font-semibold text-xs">
              {branch?.status === 'ACTIVE' ? 'Pause Branch (Temp Closed)' : 'Activate Branch'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-indigo-600 px-4 py-2 rounded-xl"
            onPress={() => router.push(`/(owner)/branches/${id}/tables` as any)}
          >
            <Text className="text-white font-semibold text-xs">🪑 Floorplan Manager →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Address & Info Card */}
      <View className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <Text className="text-xl font-bold text-slate-800 mb-3">Location & Contact Details</Text>
        <Text className="text-slate-600 text-sm">📍 {branch?.addressLine1}, {branch?.city}, {branch?.state} {branch?.postalCode}</Text>
        <Text className="text-slate-600 text-sm mt-1">📞 {branch?.phone || 'N/A'}</Text>
        <Text className="text-slate-600 text-sm mt-1">✉️ {branch?.email || 'N/A'}</Text>
      </View>

      {/* Channel & Operational Settings Card */}
      <View className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-slate-800">Operational Channel Settings</Text>
          <TouchableOpacity className="bg-blue-600 px-4 py-1.5 rounded-lg" onPress={saveSettings}>
            <Text className="text-white font-semibold text-xs">Save Settings</Text>
          </TouchableOpacity>
        </View>

        <View className="space-y-4">
          <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
            <View>
              <Text className="font-semibold text-slate-800">Accept Dine-In Orders</Text>
              <Text className="text-xs text-slate-400">Enable POS & table QR ordering</Text>
            </View>
            <Switch value={dineIn} onValueChange={setDineIn} />
          </View>

          <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
            <View>
              <Text className="font-semibold text-slate-800">Accept Takeaway / Pickup Orders</Text>
              <Text className="text-xs text-slate-400">Allow pickup order channel</Text>
            </View>
            <Switch value={takeaway} onValueChange={setTakeaway} />
          </View>

          <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
            <View>
              <Text className="font-semibold text-slate-800">Accept Delivery Orders</Text>
              <Text className="text-xs text-slate-400">Enable local fleet and 3P courier dispatch</Text>
            </View>
            <Switch value={delivery} onValueChange={setDelivery} />
          </View>

          <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
            <View>
              <Text className="font-semibold text-slate-800">Auto-Accept Incoming Orders</Text>
              <Text className="text-xs text-slate-400">Bypass manual staff acceptance</Text>
            </View>
            <Switch value={autoAccept} onValueChange={setAutoAccept} />
          </View>

          <View className="pt-2">
            <Text className="font-semibold text-slate-800 mb-1">Default Prep Time (Minutes)</Text>
            <TextInput
              className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-800 max-w-[120px]"
              value={prepMinutes}
              onChangeText={setPrepMinutes}
              keyboardType="number-pad"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
