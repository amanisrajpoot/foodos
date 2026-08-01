import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatCard } from '../../../components/ui/StatCard';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { api } from '../../../services/api';
import { useAuthStore } from '../../../stores/auth.store';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ActivityIndicator } from 'react-native';

export default function MenuListScreen() {
  const router = useRouter();
  const organizationId = useAuthStore(state => state.organizationId);
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  React.useEffect(() => {
    fetchMenus();
  }, []);

  async function fetchMenus() {
    setLoading(true);
    setError(false);
    try {
      if (!organizationId) throw new Error('No Organization ID');
      const restRes = await api.get(`/restaurants/orgs/${organizationId}/restaurants`);
      if (restRes.data && restRes.data.length > 0) {
        const restId = restRes.data[0].id;
        const res = await api.get(`/menu/restaurants/${restId}/menus`);
        setMenus(res.data || []);
      } else {
        setMenus([]);
      }
    } catch (err) {
      console.error('Failed to fetch menus:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-sm font-medium text-slate-400 mt-4">Loading Menus...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-950 p-6 sm:p-8">
        <ErrorState onRetry={fetchMenus} />
      </View>
    );
  }

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
      {menus.length === 0 ? (
        <EmptyState 
          icon="restaurant-outline" 
          title="No Menus Found" 
          description="You haven't created any menus yet. Create your first menu to get started."
          actionLabel="Create Menu"
          onAction={() => router.push('/(owner)/menu/m1/categories')}
        />
      ) : (
        <View className="gap-4">
          {menus.map((item) => (
            <Card
              key={item.id}
              glow="amber"
              title={item.name}
              subtitle={`Type: ${item.type} • Updated ${new Date(item.updatedAt || item.createdAt).toLocaleDateString()}`}
            >
              <View className="flex-row justify-between items-center mb-4 flex-wrap gap-2">
                <Badge label={item.status} variant={item.status} size="sm" />
                <Text className="text-xs font-bold text-amber-400">
                  {item.categories?.length || 0} Categories
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
      )}
    </ScrollView>
  );
}
