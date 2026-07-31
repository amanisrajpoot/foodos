import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatCard } from '../../../components/ui/StatCard';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

const MOCK_MENUS = [
  {
    id: 'm1',
    name: 'Standard Dine-In Menu',
    type: 'DINE_IN',
    status: 'ACTIVE',
    itemCount: 42,
    categoryCount: 6,
    lastUpdated: '2 hours ago',
  },
  {
    id: 'm2',
    name: 'Delivery & Online Menu',
    type: 'DELIVERY',
    status: 'ACTIVE',
    itemCount: 36,
    categoryCount: 5,
    lastUpdated: 'Yesterday',
  },
  {
    id: 'm3',
    name: 'Late Night Bar Menu',
    type: 'NIGHT_SPECIAL',
    status: 'SCHEDULED',
    itemCount: 18,
    categoryCount: 3,
    lastUpdated: '3 days ago',
  },
];

export default function MenuListScreen() {
  const router = useRouter();
  const [menus, setMenus] = useState(MOCK_MENUS);

  return (
    <ScrollView className="flex-1 bg-slate-950 p-4 sm:p-8">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8 flex-wrap gap-4">
        <View>
          <View className="flex-row items-center space-x-3 mb-1">
            <Text className="text-3xl font-extrabold text-white tracking-tight">
              Menu Engineering & Catalogs
            </Text>
            <View className="bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              <Text className="text-xs font-bold text-amber-400">Multi-Channel Active</Text>
            </View>
          </View>
          <Text className="text-slate-400 text-sm">
            Manage food menus, pricing matrices, recipe ratios & item availability
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(owner)/menu/m1/categories')}
          className="bg-amber-500 hover:bg-amber-400 px-4 py-2.5 rounded-xl flex-row items-center space-x-2 shadow-lg shadow-amber-500/25"
        >
          <Ionicons name="add-circle" size={18} color="#0f172a" />
          <Text className="text-slate-950 font-extrabold text-xs">+ Create New Menu</Text>
        </TouchableOpacity>
      </View>

      {/* KPI Metrics */}
      <View className="flex-row flex-wrap gap-4 mb-8">
        <StatCard
          title="Active Food Items"
          value="42 Items"
          change="+4 this month"
          isPositive={true}
          iconName="fast-food-outline"
          iconColor="#f59e0b"
          subtitle="Cross 6 active categories"
        />
        <StatCard
          title="Avg Margin Score"
          value="68.4%"
          change="+2.1% profit"
          isPositive={true}
          iconName="sparkles-outline"
          iconColor="#10b981"
          subtitle="Based on ingredient recipes"
        />
        <StatCard
          title="86'd Out of Stock"
          value="2 Items"
          change="Temporarily disabled"
          isPositive={false}
          iconName="ban-outline"
          iconColor="#f43f5e"
          subtitle="Auto-disabled by inventory"
        />
      </View>

      {/* Menu Cards */}
      <View className="gap-4">
        {menus.map((item) => (
          <Card
            key={item.id}
            glow="amber"
            title={item.name}
            subtitle={`Type: ${item.type} • Updated ${item.lastUpdated}`}
          >
            <View className="flex-row justify-between items-center mb-4 flex-wrap gap-2">
              <Badge label={item.status} variant={item.status} size="sm" />
              <Text className="text-xs font-bold text-amber-400">
                {item.itemCount} Items across {item.categoryCount} Categories
              </Text>
            </View>

            <View className="flex-row justify-between items-center pt-3 border-t border-slate-800 flex-wrap gap-2">
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  onPress={() => router.push(`/(owner)/menu/${item.id}/categories`)}
                  className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
                >
                  <Text className="text-xs font-bold text-slate-300">Edit Categories</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push(`/(owner)/menu/${item.id}/items`)}
                  className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
                >
                  <Text className="text-xs font-bold text-indigo-400">Manage Food Items</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => router.push(`/(owner)/menu/${item.id}`)}
                className="bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg flex-row items-center space-x-1"
              >
                <Text className="text-xs font-bold text-amber-400">Open Menu Studio →</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}
