import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { api } from '../../services/api';
import { useAuthStore } from '../../stores/auth.store';
import { ErrorState } from '../../components/ui/ErrorState';
import { Ionicons } from '@expo/vector-icons';

export default function ManagerDashboard() {
  const { organizationId, branchId } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [kpis, setKpis] = useState<any>(null);

  useEffect(() => {
    fetchKpis();
  }, [organizationId, branchId]);

  async function fetchKpis() {
    if (!organizationId) return;
    setLoading(true);
    setError(false);
    try {
      const res = await api.get(`/v1/analytics/dashboard/today?organizationId=${organizationId}&branchId=${branchId || ''}`);
      setKpis(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-sm font-medium text-slate-400 mt-4">Loading Dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-950 p-6 sm:p-8">
        <ErrorState onRetry={fetchKpis} />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-950 p-6 sm:p-8">
      <Text className="text-3xl font-extrabold text-white tracking-tight mb-8">Manager Dashboard</Text>
      
      {/* Alerts Strip */}
      <View className="bg-amber-500/10 border-l-4 border-amber-500 p-5 mb-8 rounded-r-2xl shadow-sm flex-row items-center space-x-3">
        <Ionicons name="information-circle" size={24} color="#f59e0b" />
        <Text className="text-amber-400 font-bold text-sm tracking-wide">Heads up: 3 new reservations for tonight.</Text>
      </View>

      {/* KPI Cards */}
      <View className="flex-row gap-4 mb-8">
        <View className="bg-slate-900 p-6 rounded-[1.5rem] border border-slate-800 flex-1 shadow-xl hover:border-indigo-500/50 transition-all">
          <View className="flex-row items-center space-x-2 mb-2">
            <Ionicons name="cash-outline" size={18} color="#6366f1" />
            <Text className="text-slate-400 font-extrabold text-xs uppercase tracking-wider">Today's Revenue</Text>
          </View>
          <Text className="text-3xl font-black text-white">₹{kpis?.totalRevenue || 0}</Text>
        </View>
        
        <View className="bg-slate-900 p-6 rounded-[1.5rem] border border-slate-800 flex-1 shadow-xl hover:border-emerald-500/50 transition-all">
          <View className="flex-row items-center space-x-2 mb-2">
            <Ionicons name="receipt-outline" size={18} color="#10b981" />
            <Text className="text-slate-400 font-extrabold text-xs uppercase tracking-wider">Orders Today</Text>
          </View>
          <Text className="text-3xl font-black text-white">{kpis?.orderCount || 0}</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text className="text-xl font-extrabold text-white tracking-tight mb-5">Quick Actions</Text>
      <View className="bg-slate-900 rounded-[1.5rem] border border-slate-800 overflow-hidden shadow-xl">
        <TouchableOpacity className="p-5 border-b border-slate-800/80 hover:bg-slate-800/50 flex-row justify-between items-center transition-all">
          <View className="flex-row items-center space-x-3">
            <Ionicons name="time-outline" size={20} color="#94a3b8" />
            <Text className="text-slate-200 font-bold">Approve Timesheets</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#64748b" />
        </TouchableOpacity>
        
        <TouchableOpacity className="p-5 border-b border-slate-800/80 hover:bg-slate-800/50 flex-row justify-between items-center transition-all">
          <View className="flex-row items-center space-x-3">
            <Ionicons name="warning-outline" size={20} color="#f43f5e" />
            <Text className="text-slate-200 font-bold">View Low Stock Alerts</Text>
          </View>
          <View className="flex-row items-center space-x-2">
            <View className="bg-rose-500/20 px-2 py-0.5 rounded-md border border-rose-500/30">
              <Text className="text-[10px] font-bold text-rose-400">1</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#64748b" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity className="p-5 hover:bg-slate-800/50 flex-row justify-between items-center transition-all">
          <View className="flex-row items-center space-x-3">
            <Ionicons name="document-text-outline" size={20} color="#10b981" />
            <Text className="text-slate-200 font-bold">Submit End of Day Report</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#64748b" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
