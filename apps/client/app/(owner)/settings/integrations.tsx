import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../../services/api';
import { useAuthStore } from '../../../stores/auth.store';
import { Ionicons } from '@expo/vector-icons';
import { ErrorState } from '../../../components/ui/ErrorState';

export default function IntegrationsScreen() {
  const router = useRouter();
  const organizationId = useAuthStore(state => state.organizationId);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  
  const [razorpayEnabled, setRazorpayEnabled] = useState(false);
  const [keyId, setKeyId] = useState('');
  const [keySecret, setKeySecret] = useState('');

  useEffect(() => {
    fetchProviders();
  }, []);

  async function fetchProviders() {
    setLoading(true);
    setError(false);
    try {
      if (!organizationId) return;
      const res = await api.get(`/v1/integrations/providers/${organizationId}`);
      const rzp = res.data?.find((p: any) => p.providerName === 'RAZORPAY');
      if (rzp) {
        setRazorpayEnabled(rzp.isActive);
        setKeyId(rzp.credentials?.keyId || '');
        setKeySecret(rzp.credentials?.keySecret ? '****************' : '');
      }
    } catch (err) {
      console.error('Failed to fetch integration providers:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post(`/v1/integrations/providers/${organizationId}`, {
        providerName: 'RAZORPAY',
        isActive: razorpayEnabled,
        credentials: {
          keyId,
          ...(keySecret !== '****************' ? { keySecret } : {})
        }
      });
      Alert.alert('Success', 'Integration settings saved successfully.');
    } catch (err) {
      console.error('Failed to save settings:', err);
      Alert.alert('Error', 'Failed to save integration settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-sm font-medium text-slate-400 mt-4">Loading Settings...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-950 p-6 sm:p-8">
        <ErrorState onRetry={fetchProviders} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-950">
      <View className="p-6 bg-slate-900 border-b border-slate-800 flex-row items-center z-10 shadow-xl">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-all">
          <Ionicons name="arrow-back" size={20} color="#cbd5e1" />
        </TouchableOpacity>
        <View>
          <Text className="text-3xl font-extrabold text-white tracking-tight">Integrations</Text>
          <Text className="text-slate-400 text-sm mt-0.5">Manage payment and third-party integrations</Text>
        </View>
      </View>

      <ScrollView className="p-6 sm:p-8">
        <Text className="text-xl font-extrabold text-white tracking-tight mb-6">Payment Gateways</Text>
        
        <View className="bg-slate-900 rounded-[1.5rem] p-6 sm:p-8 shadow-xl border border-slate-800 mb-8">
          <View className="flex-row justify-between items-center border-b border-slate-800/80 pb-6 mb-6">
            <View>
              <View className="flex-row items-center gap-2 mb-1">
                <View className="w-8 h-8 bg-blue-500/10 border border-blue-500/30 rounded-lg items-center justify-center">
                  <Ionicons name="card-outline" size={16} color="#60a5fa" />
                </View>
                <Text className="text-xl font-extrabold text-white tracking-tight">Razorpay</Text>
              </View>
              <Text className="text-slate-400 text-sm">Accept payments via UPI, Cards, NetBanking</Text>
            </View>
            <Switch 
              value={razorpayEnabled}
              onValueChange={setRazorpayEnabled}
              trackColor={{ false: '#334155', true: '#4f46e5' }}
              thumbColor={razorpayEnabled ? '#ffffff' : '#94a3b8'}
            />
          </View>

          {razorpayEnabled && (
            <View>
              <View className="mb-5">
                <Text className="text-slate-300 font-bold mb-2 text-xs uppercase tracking-wider">Key ID</Text>
                <TextInput 
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 font-mono"
                  value={keyId}
                  onChangeText={setKeyId}
                  placeholderTextColor="#475569"
                  placeholder="rzp_test_..."
                />
              </View>
              <View className="mb-6">
                <Text className="text-slate-300 font-bold mb-2 text-xs uppercase tracking-wider">Key Secret</Text>
                <TextInput 
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 font-mono"
                  value={keySecret}
                  onChangeText={setKeySecret}
                  secureTextEntry
                  placeholderTextColor="#475569"
                  placeholder="Secret key"
                />
              </View>
              
              <View className="bg-indigo-500/10 p-5 rounded-xl mb-6 border border-indigo-500/20">
                <Text className="text-indigo-400 font-bold mb-2 text-xs uppercase tracking-wider flex-row items-center">
                  <Ionicons name="link-outline" size={14} /> Webhook URL
                </Text>
                <Text className="text-indigo-300 font-mono text-sm bg-indigo-950/50 p-2 rounded-lg border border-indigo-500/10 select-all">https://api.foodos.com/v1/integrations/webhooks/razorpay</Text>
                <Text className="text-indigo-400/80 text-xs mt-3">Configure this URL in your Razorpay dashboard.</Text>
              </View>

              <TouchableOpacity 
                className={`bg-indigo-600 hover:bg-indigo-500 p-4 rounded-xl items-center shadow-lg shadow-indigo-600/20 transition-all ${saving ? 'opacity-70' : ''}`}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-sm tracking-wide">Save Configuration</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text className="text-xl font-extrabold text-white tracking-tight mb-6">Other Integrations</Text>
        <View className="bg-slate-900 rounded-[1.5rem] p-6 shadow-xl border border-slate-800 opacity-60 mb-8">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl items-center justify-center">
                <Ionicons name="logo-whatsapp" size={20} color="#34d399" />
              </View>
              <View>
                <Text className="text-lg font-bold text-white tracking-tight">WhatsApp Cloud API</Text>
                <Text className="text-slate-400 text-sm">Send order updates to customers</Text>
              </View>
            </View>
            <View className="bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
              <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">Coming Soon</Text>
            </View>
          </View>
        </View>

        <Text className="text-xl font-extrabold text-white tracking-tight mb-6">Webhook Event Log</Text>
        <View className="bg-slate-900 rounded-[1.5rem] shadow-xl border border-slate-800 overflow-hidden mb-12">
          <View className="flex-row bg-slate-950/50 p-5 border-b border-slate-800">
            <Text className="flex-2 font-bold text-slate-400 text-xs uppercase tracking-wider">Event</Text>
            <Text className="flex-1 font-bold text-slate-400 text-xs uppercase tracking-wider">Provider</Text>
            <Text className="flex-1 font-bold text-slate-400 text-xs uppercase tracking-wider text-center">Status</Text>
            <Text className="flex-1 font-bold text-slate-400 text-xs uppercase tracking-wider text-right">Time</Text>
          </View>
          {/* Mock Event Logs - To be wired up later */}
          {[
            { id: '1', event: 'payment.captured', provider: 'Razorpay', status: 'PROCESSED', time: '14:32' },
            { id: '2', event: 'payment.failed', provider: 'Razorpay', status: 'IGNORED', time: '12:15' }
          ].map((log, i) => (
            <View key={log.id} className={`flex-row p-5 items-center ${i === 0 ? 'border-b border-slate-800/60' : ''}`}>
              <Text className="flex-2 font-bold text-white">{log.event}</Text>
              <Text className="flex-1 text-slate-400 font-medium">{log.provider}</Text>
              <View className="flex-1 items-center">
                <View className={`px-3 py-1.5 rounded-md border ${log.status === 'PROCESSED' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800 border-slate-700'}`}>
                  <Text className={`text-[10px] uppercase tracking-wider font-extrabold ${log.status === 'PROCESSED' ? 'text-emerald-400' : 'text-slate-300'}`}>{log.status}</Text>
                </View>
              </View>
              <Text className="flex-1 text-slate-500 text-right font-medium">{log.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
