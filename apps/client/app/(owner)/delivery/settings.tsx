import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { api } from '../../../services/api';

export default function DeliverySettingsScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    try {
      const branchId = 'branch-1';
      const res = await api.get(`/v1/delivery/partners/configs?branchId=${branchId}`);
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
      console.log('Failed to fetch partner configs, using defaults');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveConfig(provider: string, isEnabled: boolean, autoDispatch: boolean, apiKey?: string) {
    setSaving(true);
    try {
      const branchId = 'branch-1';
      const organizationId = '00000000-0000-0000-0000-000000000000';
      await api.put(`/v1/delivery/partners/configs?branchId=${branchId}`, {
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
          <Text className="text-3xl font-bold text-slate-800">Delivery Partner Settings</Text>
          <Text className="text-slate-500 text-sm">Configure local fleet and 3P courier provider auto-dispatch rules</Text>
        </View>
      </View>

      {/* 1. Local Fleet Config */}
      <View className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 bg-indigo-100 rounded-xl items-center justify-center">
              <Text className="text-xl">🛵</Text>
            </View>
            <View>
              <Text className="text-lg font-bold text-slate-800">Local Branch Fleet (Self-Managed)</Text>
              <Text className="text-xs text-slate-500">Dispatch in-house branch delivery drivers</Text>
            </View>
          </View>

          <Switch value={localFleetEnabled} onValueChange={setLocalFleetEnabled} />
        </View>

        {localFleetEnabled && (
          <View className="pt-4 border-t border-slate-100 flex-row justify-between items-center">
            <View>
              <Text className="font-semibold text-slate-800 text-sm">Auto-Assign Available Local Drivers</Text>
              <Text className="text-xs text-slate-400">Automatically assign ready orders to nearest available driver</Text>
            </View>
            <Switch value={localAutoDispatch} onValueChange={setLocalAutoDispatch} />
          </View>
        )}

        <TouchableOpacity
          className="bg-indigo-600 px-4 py-2 rounded-xl mt-4 self-end"
          onPress={() => handleSaveConfig('LOCAL_FLEET', localFleetEnabled, localAutoDispatch)}
        >
          <Text className="text-white font-semibold text-xs">Save Local Fleet Rules</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Porter Delivery Config */}
      <View className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 bg-blue-100 rounded-xl items-center justify-center">
              <Text className="text-xl">📦</Text>
            </View>
            <View>
              <Text className="text-lg font-bold text-slate-800">Porter Logistics Integration</Text>
              <Text className="text-xs text-slate-500">On-demand 3P courier & 2-wheeler dispatch</Text>
            </View>
          </View>

          <Switch value={porterEnabled} onValueChange={setPorterEnabled} />
        </View>

        {porterEnabled && (
          <View className="pt-4 border-t border-slate-100 space-y-4">
            <View>
              <Text className="text-xs font-semibold text-slate-500 mb-1">Porter Production API Key</Text>
              <TextInput
                className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-800 font-mono text-xs"
                placeholder="ptr_live_xxxxxxxxx"
                value={porterApiKey}
                onChangeText={setPorterApiKey}
                secureTextEntry
              />
            </View>

            <View className="flex-row justify-between items-center">
              <View>
                <Text className="font-semibold text-slate-800 text-sm">Fallback Auto-Dispatch to Porter</Text>
                <Text className="text-xs text-slate-400">Dispatch via Porter if local fleet is busy</Text>
              </View>
              <Switch value={porterAutoDispatch} onValueChange={setPorterAutoDispatch} />
            </View>
          </View>
        )}

        <TouchableOpacity
          className="bg-blue-600 px-4 py-2 rounded-xl mt-4 self-end"
          onPress={() => handleSaveConfig('PORTER', porterEnabled, porterAutoDispatch, porterApiKey)}
        >
          <Text className="text-white font-semibold text-xs">Save Porter Integration</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Borzo & Shadowfax Fallbacks */}
      <View className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <Text className="text-lg font-bold text-slate-800 mb-2">Additional Logistics Partners</Text>
        <Text className="text-xs text-slate-500 mb-4">Borzo (WeFast) & Shadowfax on-demand courier integrations</Text>

        <View className="space-y-3">
          <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
            <Text className="font-semibold text-slate-800">Borzo (WeFast) Integration</Text>
            <Switch value={borzoEnabled} onValueChange={setBorzoEnabled} />
          </View>

          <View className="flex-row justify-between items-center py-2">
            <Text className="font-semibold text-slate-800">Shadowfax Express</Text>
            <Switch value={shadowfaxEnabled} onValueChange={setShadowfaxEnabled} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
