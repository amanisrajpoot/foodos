import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatCard } from '../../../components/ui/StatCard';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

export default function InventoryDashboard() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-slate-950 p-4 sm:p-8">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8 flex-wrap gap-4">
        <View>
          <View className="flex-row items-center space-x-3 mb-1">
            <Text className="text-3xl font-extrabold text-white tracking-tight">
              Inventory & Supply Chain Center
            </Text>
            <View className="bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              <Text className="text-xs font-bold text-amber-400">Automated Valuation</Text>
            </View>
          </View>
          <Text className="text-slate-400 text-sm">
            Ingredient stock tracking, purchase orders, supplier vendor management & food waste logs
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(owner)/inventory/ingredients/create')}
          className="bg-amber-500 hover:bg-amber-400 px-4 py-2.5 rounded-xl flex-row items-center space-x-2 shadow-lg shadow-amber-500/25"
        >
          <Ionicons name="add-circle" size={18} color="#0f172a" />
          <Text className="text-slate-950 font-extrabold text-xs">+ Create New Ingredient</Text>
        </TouchableOpacity>
      </View>

      {/* Critical Stock Warning Banner */}
      <Card glow="rose" className="mb-6">
        <View className="flex-row justify-between items-center flex-wrap gap-2">
          <View className="flex-row items-center space-x-3">
            <View className="w-10 h-10 bg-rose-500/20 rounded-xl items-center justify-center border border-rose-500/30">
              <Ionicons name="alert-circle" size={24} color="#f43f5e" />
            </View>
            <View>
              <Text className="text-base font-bold text-white">
                3 Critical Low-Stock Alerts Detected
              </Text>
              <Text className="text-xs text-rose-300">
                Tomatoes (2.5kg left), Mozzarella Cheese (1.2kg left), Cooking Oil (4L left)
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(owner)/inventory/alerts')}
            className="bg-rose-500/20 border border-rose-500/30 px-4 py-2 rounded-xl"
          >
            <Text className="text-xs font-bold text-rose-400">Review All Stock Alerts →</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* KPI Stats Row */}
      <View className="flex-row flex-wrap gap-4 mb-8">
        <StatCard
          title="Total Stock Valuation"
          value="₹4,85,200"
          change="+₹12,400"
          isPositive={true}
          iconName="cube-outline"
          iconColor="#f59e0b"
          subtitle="45 registered raw ingredients"
        />
        <StatCard
          title="Active Stock Lots"
          value="120 Lots"
          change="3 Expiring Soon"
          isPositive={false}
          iconName="layers-outline"
          iconColor="#6366f1"
          subtitle="FIFO inventory batches"
        />
        <StatCard
          title="Approved Vendors"
          value="8 Suppliers"
          change="100% Verified"
          isPositive={true}
          iconName="bus-outline"
          iconColor="#10b981"
          subtitle="Active supplier contracts"
        />
        <StatCard
          title="Open Purchase Orders"
          value="2 Pending"
          change="₹48,000 value"
          isPositive={true}
          iconName="document-text-outline"
          iconColor="#a855f7"
          subtitle="Awaiting goods receipt"
        />
      </View>

      {/* Module Navigation Grid */}
      <View className="flex-row flex-wrap gap-4 mb-8">
        <TouchableOpacity
          onPress={() => router.push('/(owner)/inventory/ingredients')}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex-1 min-w-[200px] hover:border-amber-500/50"
        >
          <Ionicons name="nutrition-outline" size={28} color="#f59e0b" />
          <Text className="text-lg font-bold text-white mt-3">Ingredient Master</Text>
          <Text className="text-xs text-slate-400 mt-1">
            Browse ingredients, unit costs & minimum safety thresholds.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(owner)/inventory/purchase-orders')}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex-1 min-w-[200px] hover:border-indigo-500/50"
        >
          <Ionicons name="cart-outline" size={28} color="#6366f1" />
          <Text className="text-lg font-bold text-white mt-3">Purchase Orders</Text>
          <Text className="text-xs text-slate-400 mt-1">
            Create vendor POs, record goods receipts & manage invoices.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(owner)/inventory/suppliers')}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex-1 min-w-[200px] hover:border-emerald-500/50"
        >
          <Ionicons name="people-outline" size={28} color="#10b981" />
          <Text className="text-lg font-bold text-white mt-3">Supplier Directory</Text>
          <Text className="text-xs text-slate-400 mt-1">
            Vendor contacts, payment terms & delivery lead times.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(owner)/inventory/waste')}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex-1 min-w-[200px] hover:border-rose-500/50"
        >
          <Ionicons name="trash-outline" size={28} color="#f43f5e" />
          <Text className="text-lg font-bold text-white mt-3">Food Waste Log</Text>
          <Text className="text-xs text-slate-400 mt-1">
            Log spoilage, kitchen waste & track financial waste loss.
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
