import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { api } from '../../services/api';

export default function ManagerDashboard() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<any>(null);

  useEffect(() => {
    async function fetchKpis() {
      try {
        const organizationId = '00000000-0000-0000-0000-000000000000';
        const res = await api.get(`/analytics/dashboard/today?organizationId=${organizationId}`);
        setKpis(res.data);
      } catch (err) {
        console.log('Failed to fetch stats, using mock data');
        setKpis({
          totalRevenue: 14500,
          orderCount: 152,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchKpis();
  }, []);

  if (loading) {
    return <ActivityIndicator className="flex-1 justify-center items-center" size="large" />;
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <Text className="text-2xl font-bold text-slate-800 mb-6 mt-4">Manager Dashboard</Text>
      
      {/* Alerts Strip */}
      <View className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded shadow-sm">
        <Text className="text-amber-800 font-semibold">Heads up: 3 new reservations for tonight.</Text>
      </View>

      {/* KPI Cards */}
      <View className="flex-row gap-4 mb-6">
        <View className="bg-white p-5 rounded-2xl border border-slate-200 flex-1 shadow-sm">
          <Text className="text-slate-500 font-medium mb-1">Today's Revenue</Text>
          <Text className="text-2xl font-bold text-slate-800">₹{kpis?.totalRevenue}</Text>
        </View>
        
        <View className="bg-white p-5 rounded-2xl border border-slate-200 flex-1 shadow-sm">
          <Text className="text-slate-500 font-medium mb-1">Orders</Text>
          <Text className="text-2xl font-bold text-slate-800">{kpis?.orderCount}</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text className="text-lg font-bold text-slate-800 mb-4">Quick Actions</Text>
      <View className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <View className="p-4 border-b border-slate-100"><Text className="text-slate-700">Approve timesheets</Text></View>
        <View className="p-4 border-b border-slate-100"><Text className="text-slate-700">View low stock alerts (1)</Text></View>
        <View className="p-4"><Text className="text-slate-700">Submit end of day report</Text></View>
      </View>
    </ScrollView>
  );
}
