import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';


export default function OwnerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [kpis, setKpis] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const organizationId = '00000000-0000-0000-0000-000000000000';
      const [kpiRes, aiRes] = await Promise.all([
        api.get(`/analytics/dashboard/today?organizationId=${organizationId}`),
        api.get(`/ai/dashboard?organizationId=${organizationId}`),
      ]);
      setKpis(kpiRes.data);
      setInsights(aiRes.data?.insights || []);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-sm font-medium text-slate-400 mt-4">Loading Executive Dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-950 p-6 sm:p-8">
        <ErrorState onRetry={loadData} />
      </View>
    );
  }

  if (!kpis) {
    return (
      <View className="flex-1 bg-slate-950 p-6 sm:p-8">
        <EmptyState title="No Dashboard Data" description="No data is available yet for this organization." />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-950 p-6 sm:p-8">
      {/* Top Banner Header */}
      <View className="flex-row justify-between items-center mb-8 flex-wrap gap-4">
        <View>
          <View className="flex-row items-center gap-3">
            <Text className="text-3xl font-extrabold text-white tracking-tight">Executive Dashboard</Text>
            <View className="bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
              <Text className="text-xs font-bold text-emerald-400">Live Analytics</Text>
            </View>
          </View>
          <Text className="text-sm text-slate-400 mt-1">Real-time multi-branch performance KPIs & AI supply chain predictions</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(owner)/insights')}
          className="bg-indigo-600 hover:bg-indigo-500 px-5 py-3 rounded-xl flex-row items-center gap-2 shadow-lg shadow-indigo-600/30"
        >
          <Ionicons name="sparkles" size={16} color="#ffffff" />
          <Text className="text-sm font-bold text-white">AI Insights Orchestrator →</Text>
        </TouchableOpacity>
      </View>

      {/* KPI Cards Row */}
      <View className="flex-row flex-wrap gap-4 mb-8">
        <View className="flex-1 min-w-[220px] bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Today's Gross Sales</Text>
            <Ionicons name="cash-outline" size={20} color="#f59e0b" />
          </View>
          <Text className="text-3xl font-extrabold text-white mb-2">₹{kpis?.totalRevenue?.toLocaleString('en-IN')}</Text>
          <Text className="text-xs font-bold text-emerald-400">+18.4% vs previous period</Text>
        </View>

        <View className="flex-1 min-w-[220px] bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Completed Orders</Text>
            <Ionicons name="receipt-outline" size={20} color="#6366f1" />
          </View>
          <Text className="text-3xl font-extrabold text-white mb-2">{kpis?.orderCount} Orders</Text>
          <Text className="text-xs font-bold text-indigo-400">+14 orders today</Text>
        </View>

        <View className="flex-1 min-w-[220px] bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Average Ticket Value</Text>
            <Ionicons name="pie-chart-outline" size={20} color="#10b981" />
          </View>
          <Text className="text-3xl font-extrabold text-white mb-2">₹{kpis?.averageTicketSize?.toFixed(2)}</Text>
          <Text className="text-xs font-bold text-emerald-400">+4.2% average ticket</Text>
        </View>

        <View className="flex-1 min-w-[220px] bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Top Selling Dish</Text>
            <Ionicons name="restaurant-outline" size={20} color="#a855f7" />
          </View>
          <Text className="text-xl font-extrabold text-white mb-2 leading-tight">{kpis?.topItem?.name}</Text>
          <Text className="text-xs font-bold text-purple-400">{kpis?.topItem?.qty} orders sold</Text>
        </View>
      </View>

      {/* AI Recommendations */}
      <View className="bg-slate-900 border border-slate-800 rounded-[1.5rem] p-6 mb-8 shadow-xl">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-extrabold text-white">✨ AI Smart Recommendations & Alerts</Text>
          <TouchableOpacity 
            onPress={() => router.push('/(owner)/insights')} 
            className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl"
          >
            <Text className="text-xs font-bold text-indigo-400">View All Feed →</Text>
          </TouchableOpacity>
        </View>

        <View className="gap-4">
          {insights.map((item) => (
            <View key={item.id} className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-5 hover:border-indigo-500/30 transition-colors">
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center gap-3">
                  <View className={`border px-2.5 py-0.5 rounded-lg ${
                    item.severity === 'CRITICAL' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-amber-500/10 border-amber-500/30'
                  }`}>
                    <Text className={`text-[10px] font-extrabold ${
                      item.severity === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
                    }`}>{item.severity}</Text>
                  </View>
                  <Text className="text-base font-bold text-white">{item.title}</Text>
                </View>
                <Text className="text-[10px] font-mono text-slate-500">{item.insightType}</Text>
              </View>
              
              <Text className="text-sm text-slate-300 leading-relaxed mb-4">{item.body}</Text>
              
              {item.recommendation && (
                <View className="bg-indigo-500/10 border border-indigo-500/20 p-3.5 rounded-xl flex-row items-start">
                  <Ionicons name="bulb" size={16} color="#818cf8" style={{ marginTop: 2, marginRight: 8 }} />
                  <View className="flex-1">
                    <Text className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider mb-1">Action Recommendation</Text>
                    <Text className="text-xs font-medium text-indigo-100/80 leading-relaxed">{item.recommendation}</Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
