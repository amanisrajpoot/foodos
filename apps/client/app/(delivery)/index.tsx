import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export default function DeliveryPartnerHubScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    // Simulate fetching delivery assignments
    setTimeout(() => {
      setAssignments([
        {
          id: 'asgn-101',
          orderNumber: 'ORD-8824',
          restaurantName: 'Downtown Gourmet Kitchen',
          restaurantAddress: '123 Main Street, Sector 4',
          customerName: 'Rahul Sharma',
          customerPhone: '+91 98765 43210',
          customerAddress: 'Flat 402, Sunshine Heights, Powai',
          status: 'ASSIGNED',
          deliveryFee: '₹85',
          distance: '3.4 km',
          estMinutes: '18 mins',
        },
        {
          id: 'asgn-102',
          orderNumber: 'ORD-8826',
          restaurantName: 'Uptown Bistro',
          restaurantAddress: '45 Park Avenue',
          customerName: 'Priya Patel',
          customerPhone: '+91 98123 45678',
          customerAddress: 'Villa 12, Palm Meadows',
          status: 'PICKED_UP',
          deliveryFee: '₹110',
          distance: '5.1 km',
          estMinutes: '24 mins',
        },
      ]);
      setLoading(false);
    }, 400);
  }, []);

  const handleUpdateStatus = (id: string, currentStatus: string) => {
    let nextStatus = 'PICKED_UP';
    if (currentStatus === 'PICKED_UP') nextStatus = 'COMPLETED';

    if (nextStatus === 'COMPLETED') {
      setAssignments((prev) => prev.filter((a) => a.id !== id));
    } else {
      setAssignments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a))
      );
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-950 p-4 sm:p-8">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8 flex-wrap gap-4">
        <View className="flex-row items-center space-x-4">
          <View className="w-12 h-12 bg-emerald-500/10 rounded-2xl items-center justify-center border border-emerald-500/20">
            <Ionicons name="bicycle" size={28} color="#10b981" />
          </View>
          <View>
            <Text className="text-3xl font-extrabold text-white tracking-tight">
              Delivery Partner Hub
            </Text>
            <Text className="text-slate-400 text-xs mt-0.5">
              Driver Portal • Code DRV-902 (Ramesh Kumar)
            </Text>
          </View>
        </View>

        {/* Duty Toggle Card */}
        <View className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl flex-row items-center space-x-3">
          <View className="items-end">
            <Text className="text-xs font-bold text-white">
              {isOnDuty ? 'ONLINE & ON DUTY' : 'OFF DUTY'}
            </Text>
            <Text className="text-[10px] text-emerald-400">Receiving auto-dispatches</Text>
          </View>
          <Switch value={isOnDuty} onValueChange={setIsOnDuty} trackColor={{ true: '#10b981' }} />
        </View>
      </View>

      {/* Driver Daily Stats Row */}
      <View className="flex-row flex-wrap gap-4 mb-8">
        <StatCard
          title="Today's Earnings"
          value="₹1,240"
          change="+₹320 tip"
          isPositive={true}
          iconName="wallet-outline"
          iconColor="#10b981"
          subtitle="9 deliveries completed"
        />
        <StatCard
          title="Active Orders"
          value={assignments.length}
          change="On track"
          isPositive={true}
          iconName="navigate-outline"
          iconColor="#f59e0b"
          subtitle="In delivery queue"
        />
        <StatCard
          title="Driver Rating"
          value="4.95 ⭐"
          change="Top 5%"
          isPositive={true}
          iconName="star-outline"
          iconColor="#a855f7"
          subtitle="Based on 140 ratings"
        />
      </View>

      {/* Active Assignments Queue */}
      <View className="mb-6 flex-row justify-between items-center">
        <Text className="text-xl font-bold text-white">Active Delivery Orders</Text>
        <TouchableOpacity
          onPress={() => router.push('/')}
          className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg"
        >
          <Text className="text-xs font-semibold text-slate-400">Return to Hub</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="py-12 items-center">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="text-slate-400 text-xs mt-2">Checking active dispatches...</Text>
        </View>
      ) : assignments.length === 0 ? (
        <Card>
          <View className="py-8 items-center">
            <Ionicons name="checkmark-done-circle-outline" size={42} color="#10b981" />
            <Text className="text-lg font-bold text-white mt-2">All Deliveries Complete!</Text>
            <Text className="text-slate-400 text-xs mt-1">
              You are online and ready for new auto-dispatches.
            </Text>
          </View>
        </Card>
      ) : (
        <View className="gap-4">
          {assignments.map((item) => (
            <Card key={item.id} glow="emerald">
              <View className="flex-row justify-between items-center mb-3 flex-wrap gap-2">
                <View className="flex-row items-center space-x-2">
                  <Badge label={item.status} variant={item.status} size="sm" />
                  <Text className="text-xl font-extrabold text-white">{item.orderNumber}</Text>
                </View>
                <View className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
                  <Text className="text-xs font-bold text-emerald-400">Payout: {item.deliveryFee}</Text>
                </View>
              </View>

              {/* Pickup & Drop Details */}
              <View className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 gap-3 mb-4">
                <View className="flex-row items-start space-x-3">
                  <Ionicons name="storefront-outline" size={20} color="#f59e0b" />
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-slate-400 uppercase">Pickup Location</Text>
                    <Text className="text-sm font-bold text-white">{item.restaurantName}</Text>
                    <Text className="text-xs text-slate-400">{item.restaurantAddress}</Text>
                  </View>
                </View>

                <View className="border-t border-slate-800/80 pt-3 flex-row items-start space-x-3">
                  <Ionicons name="location-outline" size={20} color="#10b981" />
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-slate-400 uppercase">Dropoff Customer</Text>
                    <Text className="text-sm font-bold text-white">{item.customerName} ({item.customerPhone})</Text>
                    <Text className="text-xs text-slate-300">{item.customerAddress}</Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row justify-between items-center flex-wrap gap-2">
                <View className="flex-row items-center space-x-3">
                  <Text className="text-xs text-slate-400">Est. Distance: {item.distance}</Text>
                  <Text className="text-xs text-slate-400">Time: {item.estMinutes}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleUpdateStatus(item.id, item.status)}
                  className={`px-5 py-2.5 rounded-xl ${
                    item.status === 'ASSIGNED' ? 'bg-amber-600' : 'bg-emerald-600'
                  }`}
                >
                  <Text className="text-white font-bold text-xs">
                    {item.status === 'ASSIGNED' ? 'Confirm Pickup at Restaurant ✓' : 'Mark Delivered to Customer ✓'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
