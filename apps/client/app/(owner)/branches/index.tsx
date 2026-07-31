import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../../services/api';

export default function BranchDirectoryScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState<any[]>([]);

  useEffect(() => {
    fetchBranches();
  }, []);

  async function fetchBranches() {
    setLoading(true);
    try {
      const restaurantId = 'rest-1';
      const res = await api.get(`/restaurants/${restaurantId}/branches`);
      setBranches(res.data || []);
    } catch (err) {
      console.log('Failed to fetch branches, using mock data');
      setBranches([
        {
          id: 'branch-1',
          name: 'Downtown Main Branch',
          branchCode: 'BR-001',
          branchType: 'HYBRID',
          status: 'ACTIVE',
          phone: '+919876543210',
          addressLine1: '123 Main Street',
          city: 'Mumbai',
          diningTables: [{}, {}, {}, {}],
          settings: { acceptsDineIn: true, acceptsTakeaway: true, acceptsDelivery: true },
        },
        {
          id: 'branch-2',
          name: 'Westside Cloud Kitchen',
          branchCode: 'BR-002',
          branchType: 'CLOUD_KITCHEN',
          status: 'ACTIVE',
          phone: '+919876543211',
          addressLine1: '45 Westside Express Way',
          city: 'Mumbai',
          diningTables: [],
          settings: { acceptsDineIn: false, acceptsTakeaway: true, acceptsDelivery: true },
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4 sm:p-8">
      <View className="flex-row justify-between items-center mb-6 flex-wrap gap-4">
        <View>
          <Text className="text-3xl font-bold text-slate-800">Branch Locations</Text>
          <Text className="text-slate-500 text-sm">Physical, cloud kitchen, and virtual operating branches</Text>
        </View>

        <TouchableOpacity
          className="bg-blue-600 px-4 py-2.5 rounded-xl shadow-sm"
          onPress={() => router.push('/(onboarding)/create-branch')}
        >
          <Text className="text-white font-semibold text-sm">+ Add New Branch</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator className="mt-10" size="large" />
      ) : (
        <View className="space-y-4">
          {branches.map(b => (
            <View key={b.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-row justify-between items-center flex-wrap gap-4">
              <View className="flex-1 min-w-[240px]">
                <View className="flex-row items-center gap-3 mb-1">
                  <Text className="text-xl font-bold text-slate-800">{b.name}</Text>
                  <View className="bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    <Text className="text-emerald-800 text-xs font-bold">{b.status}</Text>
                  </View>
                </View>
                <Text className="text-xs text-slate-500 font-mono mb-2">Code: {b.branchCode} • Type: {b.branchType}</Text>
                <Text className="text-sm text-slate-600">📍 {b.addressLine1}, {b.city}</Text>
                <Text className="text-sm text-slate-600">📞 {b.phone}</Text>
              </View>

              <View className="flex-row gap-2 flex-wrap">
                <TouchableOpacity
                  className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl"
                  onPress={() => router.push(`/(owner)/branches/${b.id}/tables` as any)}
                >
                  <Text className="text-indigo-700 text-xs font-semibold">🪑 Floorplan & Tables</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl"
                  onPress={() => router.push(`/(owner)/branches/${b.id}` as any)}
                >
                  <Text className="text-slate-700 text-xs font-semibold">⚙️ Control Panel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
