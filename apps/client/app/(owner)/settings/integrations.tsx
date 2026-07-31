import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function IntegrationsScreen() {
  const router = useRouter();
  const [razorpayEnabled, setRazorpayEnabled] = useState(true);
  const [keyId, setKeyId] = useState('rzp_test_1234567890');
  const [keySecret, setKeySecret] = useState('****************');

  const handleSave = () => {
    Alert.alert('Success', 'Integration settings saved successfully.');
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-6 bg-white border-b border-gray-100">
        <Text className="text-3xl font-bold text-gray-900">Integrations</Text>
        <Text className="text-gray-500 mt-1">Manage payment and third-party integrations</Text>
      </View>

      <ScrollView className="p-6">
        <Text className="text-xl font-bold text-gray-900 mb-4">Payment Gateways</Text>
        
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <View className="flex-row justify-between items-center border-b border-gray-100 pb-4 mb-4">
            <View>
              <Text className="text-lg font-bold text-gray-900">Razorpay</Text>
              <Text className="text-gray-500 text-sm mt-1">Accept payments via UPI, Cards, NetBanking</Text>
            </View>
            <Switch 
              value={razorpayEnabled}
              onValueChange={setRazorpayEnabled}
              trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
              thumbColor={razorpayEnabled ? '#2563eb' : '#9ca3af'}
            />
          </View>

          {razorpayEnabled && (
            <View>
              <View className="mb-4">
                <Text className="text-gray-700 font-bold mb-2">Key ID</Text>
                <TextInput 
                  className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900"
                  value={keyId}
                  onChangeText={setKeyId}
                />
              </View>
              <View className="mb-4">
                <Text className="text-gray-700 font-bold mb-2">Key Secret</Text>
                <TextInput 
                  className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900"
                  value={keySecret}
                  onChangeText={setKeySecret}
                  secureTextEntry
                />
              </View>
              
              <View className="bg-blue-50 p-4 rounded-xl mb-4 border border-blue-100">
                <Text className="text-blue-800 font-bold mb-1">Webhook URL</Text>
                <Text className="text-blue-600 font-mono text-sm">https://api.foodos.com/v1/integrations/webhooks/razorpay</Text>
                <Text className="text-blue-700 text-xs mt-2">Configure this URL in your Razorpay dashboard.</Text>
              </View>

              <TouchableOpacity 
                className="bg-blue-600 p-3 rounded-xl items-center"
                onPress={handleSave}
              >
                <Text className="text-white font-bold">Save Configuration</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text className="text-xl font-bold text-gray-900 mb-4">Other Integrations</Text>
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 opacity-50 mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <View>
              <Text className="text-lg font-bold text-gray-900">WhatsApp Cloud API</Text>
              <Text className="text-gray-500 text-sm mt-1">Send order updates to customers</Text>
            </View>
            <View className="bg-gray-200 px-3 py-1 rounded-full">
              <Text className="text-gray-600 text-xs font-bold">Coming Soon</Text>
            </View>
          </View>
        </View>

        <Text className="text-xl font-bold text-gray-900 mb-4">Webhook Event Log</Text>
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <View className="flex-row bg-gray-50 p-4 border-b border-gray-100">
            <Text className="flex-2 font-bold text-gray-700">Event</Text>
            <Text className="flex-1 font-bold text-gray-700">Provider</Text>
            <Text className="flex-1 font-bold text-gray-700 text-center">Status</Text>
            <Text className="flex-1 font-bold text-gray-700 text-right">Time</Text>
          </View>
          {/* Mock Event Logs */}
          {[
            { id: '1', event: 'payment.captured', provider: 'Razorpay', status: 'PROCESSED', time: '14:32' },
            { id: '2', event: 'payment.failed', provider: 'Razorpay', status: 'IGNORED', time: '12:15' }
          ].map((log, i) => (
            <View key={log.id} className={`flex-row p-4 items-center ${i === 0 ? 'border-b border-gray-50' : ''}`}>
              <Text className="flex-2 font-semibold text-gray-900">{log.event}</Text>
              <Text className="flex-1 text-gray-600">{log.provider}</Text>
              <View className="flex-1 items-center">
                <View className={`px-2 py-1 rounded-md ${log.status === 'PROCESSED' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Text className={`text-xs font-bold ${log.status === 'PROCESSED' ? 'text-green-800' : 'text-gray-800'}`}>{log.status}</Text>
                </View>
              </View>
              <Text className="flex-1 text-gray-500 text-right">{log.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
