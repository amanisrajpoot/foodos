import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { api } from '../../../services/api';
import { Ionicons } from '@expo/vector-icons';
import { ErrorState } from '../../../components/ui/ErrorState';
import { useAuthStore } from '../../../stores/auth.store';

export default function DeliverySettingsScreen() {
  const organizationId = useAuthStore(state => state.organizationId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeBranchId, setActiveBranchId] = useState('branch-1');

  // Local Fleet Config
  const [localFleetEnabled, setLocalFleetEnabled] = useState(true);
  const [localAutoDispatch, setLocalAutoDispatch] = useState(true);

  // Porter Config
  const [porterEnabled, setPorterEnabled] = useState(false);
  const [porterApiKey, setPorterApiKey] = useState('');
  const [porterAutoDispatch, setPorterAutoDispatch] = useState(false);

  // Borzo Config
  const [borzoEnabled, setBorzoEnabled] = useState(false);
  const [borzoApiKey, setBorzoApiKey] = useState('');

  // Shadowfax Config
  const [shadowfaxEnabled, setShadowfaxEnabled] = useState(false);

  useEffect(() => {
    fetchConfigs();
  }, []);

  async function fetchConfigs() {
    setLoading(true);
    setError(false);
    try {
      if (!organizationId) throw new Error('No Organization ID');
      const restRes = await api.get(`/v1/restaurants/orgs/${organizationId}/restaurants`);
      let resolvedBranchId = 'branch-1';
      if (restRes.data && restRes.data.length > 0) {
        const branchRes = await api.get(`/v1/restaurants/${restRes.data[0].id}/branches`);
        if (branchRes.data && branchRes.data.length > 0) {
          resolvedBranchId = branchRes.data[0].id;
        }
      }
      setActiveBranchId(resolvedBranchId);

      const res = await api.get(`/v1/delivery/partners/configs?branchId=${resolvedBranchId}`);
      const configs = res.data || [];

      const local = configs.find((c: any) => c.provider === 'LOCAL_FLEET');
      if (local) {
        setLocalFleetEnabled(local.isEnabled);
        setLocalAutoDispatch(local.autoDispatch);
      }

      const porter = configs.find((c: any) => c.provider === 'PORTER');
      if (porter) {
        setPorterEnabled(porter.isEnabled);
        setPorterApiKey(porter.apiKey || '');
        setPorterAutoDispatch(porter.autoDispatch);
      }
    } catch (err) {
      console.error('Failed to fetch partner configs:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveConfig(provider: string, isEnabled: boolean, autoDispatch: boolean, apiKey?: string) {
    if (!organizationId) return;
    setSaving(true);
    try {
      await api.put(`/v1/delivery/partners/configs?branchId=${activeBranchId}`, {
        organizationId,
        provider,
        isEnabled,
        autoDispatch,
        apiKey,
      });
      alert(`${provider} partner configuration saved!`);
    } catch (err) {
      console.log('Save partner config error', err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-sm font-medium text-slate-400 mt-4">Loading Configurations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-950 p-6 sm:p-8">
        <ErrorState onRetry={fetchConfigs} />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-950 p-6 sm:p-8">
      {/* Header */}
      <View className="mb-8">
        <Text className="text-3xl font-extrabold text-white tracking-tight">Delivery Partner Settings</Text>
        <Text className="text-slate-400 text-sm mt-1">Configure local fleet and 3P courier provider auto-dispatch rules</Text>
      </View>

      {/* 1. Local Fleet Config */}
      <View className="bg-slate-900 p-6 rounded-[1.5rem] border border-slate-800 shadow-xl mb-6">
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center gap-4">
            <View className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl items-center justify-center">
              <Text className="text-2xl">🛵</Text>
            </View>
            <View>
              <Text className="text-xl font-extrabold text-white">Local Branch Fleet</Text>
              <Text className="text-xs text-slate-400">Dispatch in-house branch delivery drivers</Text>
            </View>
          </View>

          <Switch value={localFleetEnabled} onValueChange={setLocalFleetEnabled} trackColor={{ true: '#4f46e5', false: '#334155' }} thumbColor="#ffffff" />
        </View>

        {localFleetEnabled && (
          <View className="pt-5 border-t border-slate-800/80 flex-row justify-between items-center mb-4">
            <View className="flex-1 pr-4">
              <Text className="font-bold text-slate-200 text-sm mb-1">Auto-Assign Available Local Drivers</Text>
              <Text className="text-xs text-slate-500">Automatically assign ready orders to nearest available driver</Text>
            </View>
            <Switch value={localAutoDispatch} onValueChange={setLocalAutoDispatch} trackColor={{ true: '#4f46e5', false: '#334155' }} thumbColor="#ffffff" />
          </View>
        )}

        <TouchableOpacity
          className="bg-indigo-600 hover:bg-indigo-500 px-5 py-3 rounded-xl mt-4 self-end shadow-lg shadow-indigo-600/30 flex-row items-center gap-2"
          onPress={() => handleSaveConfig('LOCAL_FLEET', localFleetEnabled, localAutoDispatch)}
          disabled={saving}
        >
          <Ionicons name="save-outline" size={16} color="#ffffff" />
          <Text className="text-white font-bold text-xs">{saving ? 'Saving...' : 'Save Local Fleet Rules'}</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Porter Delivery Config */}
      <View className="bg-slate-900 p-6 rounded-[1.5rem] border border-slate-800 shadow-xl mb-6">
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center gap-4">
            <View className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl items-center justify-center">
              <Text className="text-2xl">📦</Text>
            </View>
            <View>
              <Text className="text-xl font-extrabold text-white">Porter Integration</Text>
              <Text className="text-xs text-slate-400">On-demand 3P courier dispatch</Text>
            </View>
          </View>

          <Switch value={porterEnabled} onValueChange={setPorterEnabled} trackColor={{ true: '#2563eb', false: '#334155' }} thumbColor="#ffffff" />
        </View>

        {porterEnabled && (
          <View className="pt-5 border-t border-slate-800/80 space-y-6 mb-4">
            <View>
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Porter API Key</Text>
              <View className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-1">
                <TextInput
                  className="text-slate-100 font-mono text-sm py-3 outline-none"
                  placeholder="ptr_live_xxxxxxxxx"
                  placeholderTextColor="#475569"
                  value={porterApiKey}
                  onChangeText={setPorterApiKey}
                  secureTextEntry
                />
              </View>
            </View>

            <View className="flex-row justify-between items-center">
              <View className="flex-1 pr-4">
                <Text className="font-bold text-slate-200 text-sm mb-1">Fallback Auto-Dispatch to Porter</Text>
                <Text className="text-xs text-slate-500">Dispatch via Porter if local fleet is busy or unavailable</Text>
              </View>
              <Switch value={porterAutoDispatch} onValueChange={setPorterAutoDispatch} trackColor={{ true: '#2563eb', false: '#334155' }} thumbColor="#ffffff" />
            </View>
          </View>
        )}

        <TouchableOpacity
          className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl mt-4 self-end shadow-lg shadow-blue-600/30 flex-row items-center gap-2"
          onPress={() => handleSaveConfig('PORTER', porterEnabled, porterAutoDispatch, porterApiKey)}
          disabled={saving}
        >
          <Ionicons name="save-outline" size={16} color="#ffffff" />
          <Text className="text-white font-bold text-xs">{saving ? 'Saving...' : 'Save Porter Integration'}</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Borzo & Shadowfax Fallbacks */}
      <View className="bg-slate-900 p-6 rounded-[1.5rem] border border-slate-800 shadow-xl mb-12">
        <View className="mb-6">
          <Text className="text-xl font-extrabold text-white">Additional Logistics Partners</Text>
          <Text className="text-xs text-slate-400 mt-1">Configure secondary fallbacks for peak hours</Text>
        </View>

        <View className="space-y-2">
          <View className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex-row justify-between items-center mb-2">
            <View>
              <Text className="font-bold text-slate-200">Borzo (WeFast)</Text>
              <Text className="text-[11px] text-slate-500 mt-0.5">Integration configured via dashboard</Text>
            </View>
            <Switch value={borzoEnabled} onValueChange={setBorzoEnabled} trackColor={{ true: '#f59e0b', false: '#334155' }} thumbColor="#ffffff" />
          </View>

          <View className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex-row justify-between items-center">
            <View>
              <Text className="font-bold text-slate-200">Shadowfax Express</Text>
              <Text className="text-[11px] text-slate-500 mt-0.5">Integration configured via dashboard</Text>
            </View>
            <Switch value={shadowfaxEnabled} onValueChange={setShadowfaxEnabled} trackColor={{ true: '#ef4444', false: '#334155' }} thumbColor="#ffffff" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
