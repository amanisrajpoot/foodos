import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../services/api';
import { ErrorState } from '../../components/ui/ErrorState';
import { ToastOverlay, useToastStore } from '../../components/ui/ToastOverlay';

export default function DeliveryDetailScreen() {
  const { assignmentId } = useLocalSearchParams();
  const router = useRouter();
  const showToast = useToastStore((s: any) => s.showToast);

  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      setError(false);
      setLoading(true);
      const res = await api.get(`/delivery/assignments/${assignmentId}`);
      setAssignment(res.data);
    } catch (err) {
      console.error('Failed to fetch assignment', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const openMaps = (lat?: number, lng?: number, address?: string, label?: string) => {
    if (lat && lng) {
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open maps'));
    } else if (address) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open maps'));
    } else {
      Alert.alert('Location Unavailable', 'No coordinates or address found to navigate to.');
    }
  };

  const callCustomer = () => {
    if (assignment?.order?.customer?.phone) {
      Linking.openURL(`tel:${assignment.order.customer.phone}`);
    } else {
      Alert.alert('No Phone', 'Customer phone number not available.');
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      await api.patch(`/delivery/assignments/${assignmentId}/status`, { status: newStatus });
      showToast('success', `Status updated to ${newStatus.replace(/_/g, ' ')}`);
      setAssignment((prev: any) => ({ ...prev, status: newStatus }));
      
      if (newStatus === 'DELIVERED') {
        setTimeout(() => router.back(), 1500);
      }
    } catch (err) {
      console.error('Failed to update status', err);
      showToast('error', 'Failed to update assignment status');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="text-slate-400 mt-4 font-bold tracking-widest uppercase text-xs">Loading Assignment...</Text>
      </View>
    );
  }

  if (error || !assignment) {
    return (
      <View className="flex-1 bg-slate-950 p-6 sm:p-8">
        <ErrorState onRetry={fetchAssignment} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-950">
      <ToastOverlay />
      
      <ScrollView className="flex-1 p-4 sm:p-8">
        {/* Header Card */}
        <View className="bg-slate-900 border border-slate-800 rounded-[1.5rem] p-6 mb-6 shadow-2xl">
          <View className="flex-row justify-between items-center mb-2 flex-wrap gap-2">
            <Text className="text-3xl font-black text-white tracking-tighter">
              {assignment.order?.orderNumber || 'Delivery Task'}
            </Text>
            <View className={`px-4 py-1.5 rounded-lg border ${
              assignment.status === 'ASSIGNED' || assignment.status === 'PENDING' ? 'bg-amber-500/10 border-amber-500/30' :
              assignment.status === 'PICKED_UP' ? 'bg-blue-500/10 border-blue-500/30' :
              assignment.status === 'DELIVERED' ? 'bg-slate-800 border-slate-700' :
              'bg-emerald-500/10 border-emerald-500/30'
            }`}>
              <Text className={`text-xs font-black uppercase tracking-widest ${
                assignment.status === 'ASSIGNED' || assignment.status === 'PENDING' ? 'text-amber-400' :
                assignment.status === 'PICKED_UP' ? 'text-blue-400' :
                assignment.status === 'DELIVERED' ? 'text-slate-400' :
                'text-emerald-400'
              }`}>
                {assignment.status.replace(/_/g, ' ')}
              </Text>
            </View>
          </View>
          <Text className="text-slate-400 font-bold tracking-wider text-xs uppercase">
            Order Payout: ₹{Math.floor(Math.random() * 50) + 40}
          </Text>
        </View>

        {/* Pickup Location */}
        <View className="bg-slate-900 border border-slate-800 rounded-[1.5rem] p-5 mb-6 shadow-xl">
          <View className="flex-row items-center space-x-3 mb-4">
            <View className="w-10 h-10 rounded-full bg-amber-500/10 items-center justify-center border border-amber-500/20">
              <Ionicons name="storefront" size={20} color="#f59e0b" />
            </View>
            <Text className="text-lg font-black text-white tracking-tight uppercase">Pickup Details</Text>
          </View>
          <View className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 mb-4">
            <Text className="text-base font-bold text-white">{assignment.branch?.name || 'Restaurant'}</Text>
            <Text className="text-sm text-slate-400 mt-1">{assignment.branch?.address || 'Address not provided'}</Text>
          </View>
          <TouchableOpacity 
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 py-3.5 rounded-xl flex-row items-center justify-center space-x-2 transition-all shadow-sm"
            onPress={() => openMaps(undefined, undefined, assignment.branch?.address, 'Restaurant')}
          >
            <Ionicons name="navigate-outline" size={18} color="#f8fafc" />
            <Text className="text-white font-black uppercase tracking-wider text-xs">Navigate to Pickup</Text>
          </TouchableOpacity>
        </View>

        {/* Dropoff Location */}
        <View className="bg-slate-900 border border-slate-800 rounded-[1.5rem] p-5 mb-6 shadow-xl">
          <View className="flex-row items-center space-x-3 mb-4">
            <View className="w-10 h-10 rounded-full bg-emerald-500/10 items-center justify-center border border-emerald-500/20">
              <Ionicons name="location" size={20} color="#10b981" />
            </View>
            <Text className="text-lg font-black text-white tracking-tight uppercase">Dropoff Details</Text>
          </View>
          <View className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 mb-4">
            <Text className="text-base font-bold text-white">{assignment.order?.customer?.name || 'Customer'}</Text>
            <Text className="text-sm text-slate-400 mt-1">{assignment.customerAddress?.addressLine1 || 'Address not provided'}</Text>
            {assignment.customerAddress?.city && (
              <Text className="text-sm text-slate-400">{assignment.customerAddress.city}</Text>
            )}
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity 
              className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 py-3.5 rounded-xl flex-row items-center justify-center space-x-2 transition-all shadow-sm"
              onPress={() => openMaps(assignment.customerAddress?.latitude, assignment.customerAddress?.longitude, assignment.customerAddress?.addressLine1, 'Customer')}
            >
              <Ionicons name="navigate-outline" size={18} color="#f8fafc" />
              <Text className="text-white font-black uppercase tracking-wider text-xs">Navigate</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 py-3.5 rounded-xl flex-row items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-600/20"
              onPress={callCustomer}
            >
              <Ionicons name="call-outline" size={18} color="#f8fafc" />
              <Text className="text-white font-black uppercase tracking-wider text-xs">Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Items */}
        <View className="bg-slate-900 border border-slate-800 rounded-[1.5rem] p-5 mb-8 shadow-xl">
          <View className="flex-row items-center space-x-3 mb-4">
            <View className="w-10 h-10 rounded-full bg-blue-500/10 items-center justify-center border border-blue-500/20">
              <Ionicons name="receipt-outline" size={20} color="#3b82f6" />
            </View>
            <Text className="text-lg font-black text-white tracking-tight uppercase">Order Items</Text>
          </View>
          <View className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 gap-3">
            {assignment.order?.items?.map((item: any) => (
              <View key={item.id} className="flex-row items-center">
                <Text className="text-amber-400 font-black text-base mr-3 w-6 text-right">
                  {item.quantity}x
                </Text>
                <Text className="text-slate-200 font-bold text-base flex-1">
                  {item.nameSnapshot}
                </Text>
              </View>
            ))}
            {(!assignment.order?.items || assignment.order.items.length === 0) && (
              <Text className="text-slate-400 text-sm">No items detailed.</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Footer */}
      <View className="bg-slate-900/90 border-t border-slate-800 p-4 pb-8 backdrop-blur-md">
        {(assignment.status === 'ASSIGNED' || assignment.status === 'PENDING') && (
          <TouchableOpacity 
            className="bg-amber-600 hover:bg-amber-500 py-4 rounded-[1.25rem] items-center shadow-xl shadow-amber-600/20 border border-amber-500" 
            onPress={() => updateStatus('PICKED_UP')}
          >
            <Text className="text-white font-black text-sm tracking-wider uppercase">Confirm Pickup at Restaurant ✓</Text>
          </TouchableOpacity>
        )}
        {assignment.status === 'PICKED_UP' && (
          <TouchableOpacity 
            className="bg-blue-600 hover:bg-blue-500 py-4 rounded-[1.25rem] items-center shadow-xl shadow-blue-600/20 border border-blue-500" 
            onPress={() => updateStatus('OUT_FOR_DELIVERY')}
          >
            <Text className="text-white font-black text-sm tracking-wider uppercase">Start Delivery (En Route) 🚀</Text>
          </TouchableOpacity>
        )}
        {assignment.status === 'OUT_FOR_DELIVERY' && (
          <TouchableOpacity 
            className="bg-emerald-600 hover:bg-emerald-500 py-4 rounded-[1.25rem] items-center shadow-xl shadow-emerald-600/20 border border-emerald-500" 
            onPress={() => updateStatus('DELIVERED')}
          >
            <Text className="text-white font-black text-sm tracking-wider uppercase">Mark as Delivered ✓</Text>
          </TouchableOpacity>
        )}
        {assignment.status === 'DELIVERED' && (
          <View className="bg-slate-800/50 py-4 rounded-[1.25rem] items-center border border-slate-700/50">
            <Text className="text-slate-400 font-black text-sm tracking-wider uppercase">Delivery Completed 🎉</Text>
          </View>
        )}
      </View>
    </View>
  );
}
