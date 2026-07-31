import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../stores/auth.store';
import { StatCard } from '../components/ui/StatCard';

export default function Index() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [activeTab, setActiveTab] = useState<'ALL' | 'MANAGEMENT' | 'OPERATIONS'>('ALL');

  const handleQuickLogin = (role: 'OWNER' | 'STAFF' | 'DRIVER', targetRoute: any) => {
    login({ id: `user_${role.toLowerCase()}`, email: `${role.toLowerCase()}@foodos.app` }, role);
    router.push(targetRoute);
  };

  return (
    <ScrollView className="flex-1 bg-slate-950 px-4 sm:px-8 py-10">
      <View className="max-w-6xl mx-auto w-full">
        {/* Hero Banner Header */}
        <View className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-8 rounded-3xl border border-slate-800 mb-8 shadow-xl relative overflow-hidden">
          <View className="flex-row items-center justify-between flex-wrap gap-4">
            <View className="flex-1 min-w-[280px]">
              <View className="flex-row items-center space-x-3 mb-3">
                <View className="w-12 h-12 bg-amber-500 rounded-2xl items-center justify-center shadow-lg shadow-amber-500/30">
                  <Ionicons name="restaurant" size={28} color="#0f172a" />
                </View>
                <View>
                  <Text className="text-3xl font-extrabold text-white tracking-tight">
                    Food<Text className="text-amber-400">OS</Text>
                  </Text>
                  <Text className="text-xs font-semibold text-amber-400/90 tracking-widest uppercase">
                    Enterprise Operating System
                  </Text>
                </View>
              </View>
              <Text className="text-slate-300 text-base mt-2 max-w-xl">
                Multi-tenant restaurant cloud platform, AI supply chain forecasting & real-time delivery fleet orchestrator.
              </Text>
            </View>

            {/* Quick Live System Health Badge */}
            <View className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl flex-row items-center space-x-3">
              <View className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <View>
                <Text className="text-xs font-bold text-slate-300">API Gateway Online</Text>
                <Text className="text-[10px] text-emerald-400 font-mono">http://localhost:3000</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Executive Quick Stats Row */}
        <View className="flex-row flex-wrap gap-4 mb-8">
          <StatCard
            title="Total Revenue Today"
            value="₹1,48,920"
            change="+18.4%"
            isPositive={true}
            iconName="cash-outline"
            iconColor="#f59e0b"
            subtitle="Across 3 active branches"
          />
          <StatCard
            title="Active Orders"
            value="42 Orders"
            change="+6 orders"
            isPositive={true}
            iconName="receipt-outline"
            iconColor="#6366f1"
            subtitle="18 Dine-in, 14 Delivery, 10 Takeaway"
          />
          <StatCard
            title="Active Fleet Drivers"
            value="12 On Duty"
            change="100% active"
            isPositive={true}
            iconName="bicycle-outline"
            iconColor="#10b981"
            subtitle="Avg delivery time 24 mins"
          />
          <StatCard
            title="AI Low Stock Alerts"
            value="3 Ingredient Alerts"
            change="2 Critical"
            isPositive={false}
            iconName="alert-circle-outline"
            iconColor="#f43f5e"
            subtitle="Predicted depletion in 48h"
          />
        </View>

        {/* Tab Navigation Filter */}
        <View className="flex-row items-center justify-between mb-6 pb-2 border-b border-slate-800">
          <Text className="text-xl font-bold text-white tracking-tight">Interactive Feature Portals</Text>
          <View className="flex-row bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(['ALL', 'MANAGEMENT', 'OPERATIONS'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg ${
                  activeTab === tab ? 'bg-amber-500' : 'bg-transparent'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    activeTab === tab ? 'text-slate-950' : 'text-slate-400'
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Portal Cards Grid */}
        <View className="gap-4 mb-12">
          {/* Executive Owner Dashboard */}
          {(activeTab === 'ALL' || activeTab === 'MANAGEMENT') && (
            <TouchableOpacity
              onPress={() => handleQuickLogin('OWNER', '/(owner)')}
              className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-amber-500/50 flex-row items-center justify-between shadow-lg"
            >
              <View className="flex-row items-center flex-1 pr-4">
                <View className="w-14 h-14 bg-amber-500/10 rounded-2xl items-center justify-center mr-4 border border-amber-500/20">
                  <Ionicons name="bar-chart" size={28} color="#f59e0b" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center space-x-2">
                    <Text className="text-xl font-bold text-white">Owner & Executive Dashboard</Text>
                    <View className="bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">
                      <Text className="text-[10px] font-bold text-amber-400 uppercase">Core</Text>
                    </View>
                  </View>
                  <Text className="text-slate-400 text-sm mt-1">
                    Multi-branch revenue analytics, AI inventory predictions & real-time business summary reports.
                  </Text>
                </View>
              </View>
              <View className="w-10 h-10 rounded-xl bg-slate-800 items-center justify-center">
                <Ionicons name="arrow-forward" size={20} color="#f59e0b" />
              </View>
            </TouchableOpacity>
          )}

          {/* AI Insights Panel */}
          {(activeTab === 'ALL' || activeTab === 'MANAGEMENT') && (
            <TouchableOpacity
              onPress={() => handleQuickLogin('OWNER', '/(owner)/insights')}
              className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 flex-row items-center justify-between shadow-lg"
            >
              <View className="flex-row items-center flex-1 pr-4">
                <View className="w-14 h-14 bg-indigo-500/10 rounded-2xl items-center justify-center mr-4 border border-indigo-500/20">
                  <Ionicons name="sparkles" size={28} color="#6366f1" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center space-x-2">
                    <Text className="text-xl font-bold text-white">AI Insights & LLM Orchestrator</Text>
                    <View className="bg-indigo-500/20 px-2 py-0.5 rounded-md border border-indigo-500/30">
                      <Text className="text-[10px] font-bold text-indigo-400 uppercase">OpenAI & Custom API</Text>
                    </View>
                  </View>
                  <Text className="text-slate-400 text-sm mt-1">
                    Demand forecasting, ingredient depletion dates, anomaly detection & interactive AI assistant prompt.
                  </Text>
                </View>
              </View>
              <View className="w-10 h-10 rounded-xl bg-slate-800 items-center justify-center">
                <Ionicons name="arrow-forward" size={20} color="#6366f1" />
              </View>
            </TouchableOpacity>
          )}

          {/* Delivery Partner & Fleet Hub */}
          {(activeTab === 'ALL' || activeTab === 'OPERATIONS') && (
            <TouchableOpacity
              onPress={() => handleQuickLogin('DRIVER', '/(delivery)')}
              className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/50 flex-row items-center justify-between shadow-lg"
            >
              <View className="flex-row items-center flex-1 pr-4">
                <View className="w-14 h-14 bg-emerald-500/10 rounded-2xl items-center justify-center mr-4 border border-emerald-500/20">
                  <Ionicons name="bicycle" size={28} color="#10b981" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center space-x-2">
                    <Text className="text-xl font-bold text-white">Delivery Fleet Management</Text>
                    <View className="bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      <Text className="text-[10px] font-bold text-emerald-400 uppercase">Live Fleet</Text>
                    </View>
                  </View>
                  <Text className="text-slate-400 text-sm mt-1">
                    Driver onboarding wizard, KYC document status, active dispatch queue & real-time coordinate tracking.
                  </Text>
                </View>
              </View>
              <View className="w-10 h-10 rounded-xl bg-slate-800 items-center justify-center">
                <Ionicons name="arrow-forward" size={20} color="#10b981" />
              </View>
            </TouchableOpacity>
          )}

          {/* Kitchen Display System KDS */}
          {(activeTab === 'ALL' || activeTab === 'OPERATIONS') && (
            <TouchableOpacity
              onPress={() => router.push('/(kitchen)')}
              className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-purple-500/50 flex-row items-center justify-between shadow-lg"
            >
              <View className="flex-row items-center flex-1 pr-4">
                <View className="w-14 h-14 bg-purple-500/10 rounded-2xl items-center justify-center mr-4 border border-purple-500/20">
                  <Ionicons name="flame" size={28} color="#a855f7" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center space-x-2">
                    <Text className="text-xl font-bold text-white">Kitchen Display System (KDS)</Text>
                    <View className="bg-purple-500/20 px-2 py-0.5 rounded-md border border-purple-500/30">
                      <Text className="text-[10px] font-bold text-purple-400 uppercase">Live KDS</Text>
                    </View>
                  </View>
                  <Text className="text-slate-400 text-sm mt-1">
                    High-contrast ticket display, station filter tabs (Grill, Prep, Assembly), and cook timers.
                  </Text>
                </View>
              </View>
              <View className="w-10 h-10 rounded-xl bg-slate-800 items-center justify-center">
                <Ionicons name="arrow-forward" size={20} color="#a855f7" />
              </View>
            </TouchableOpacity>
          )}

          {/* Staff POS Terminal */}
          {(activeTab === 'ALL' || activeTab === 'OPERATIONS') && (
            <TouchableOpacity
              onPress={() => handleQuickLogin('STAFF', '/(staff)')}
              className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-amber-500/50 flex-row items-center justify-between shadow-lg"
            >
              <View className="flex-row items-center flex-1 pr-4">
                <View className="w-14 h-14 bg-amber-500/10 rounded-2xl items-center justify-center mr-4 border border-amber-500/20">
                  <Ionicons name="card" size={28} color="#f59e0b" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center space-x-2">
                    <Text className="text-xl font-bold text-white">Staff POS & Table Manager</Text>
                    <View className="bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">
                      <Text className="text-[10px] font-bold text-amber-400 uppercase">POS Terminal</Text>
                    </View>
                  </View>
                  <Text className="text-slate-400 text-sm mt-1">
                    Visual floorplan table grid, fast menu category tabs, order cart builder & instant checkout.
                  </Text>
                </View>
              </View>
              <View className="w-10 h-10 rounded-xl bg-slate-800 items-center justify-center">
                <Ionicons name="arrow-forward" size={20} color="#f59e0b" />
              </View>
            </TouchableOpacity>
          )}

          {/* Restaurant Onboarding Wizard */}
          {(activeTab === 'ALL' || activeTab === 'MANAGEMENT') && (
            <TouchableOpacity
              onPress={() => router.push('/(onboarding)/create-org')}
              className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-blue-500/50 flex-row items-center justify-between shadow-lg"
            >
              <View className="flex-row items-center flex-1 pr-4">
                <View className="w-14 h-14 bg-blue-500/10 rounded-2xl items-center justify-center mr-4 border border-blue-500/20">
                  <Ionicons name="business" size={28} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center space-x-2">
                    <Text className="text-xl font-bold text-white">Restaurant Onboarding Wizard</Text>
                    <View className="bg-blue-500/20 px-2 py-0.5 rounded-md border border-blue-500/30">
                      <Text className="text-[10px] font-bold text-blue-400 uppercase">Onboarding</Text>
                    </View>
                  </View>
                  <Text className="text-slate-400 text-sm mt-1">
                    Register organization, brand identity, branch cutover settings & tax category configurations.
                  </Text>
                </View>
              </View>
              <View className="w-10 h-10 rounded-xl bg-slate-800 items-center justify-center">
                <Ionicons name="arrow-forward" size={20} color="#3b82f6" />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
