import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../../services/api';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';

export default function RestaurantsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<any[]>([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  async function fetchRestaurants() {
    setLoading(true);
    try {
      const organizationId = '00000000-0000-0000-0000-000000000000';
      const res = await api.get(`/restaurants/orgs/${organizationId}/restaurants`);
      setRestaurants(res.data || []);
    } catch (err) {
      setRestaurants([
        {
          id: 'rest-1',
          name: 'Burger Palace',
          slug: 'burger-palace',
          cuisineTypes: ['FAST_FOOD', 'BURGERS'],
          status: 'ACTIVE',
          primaryContactName: 'John Owner',
          primaryContactPhone: '+919876543210',
          branches: [
            { id: 'branch-1', name: 'Downtown Main Branch', status: 'ACTIVE', city: 'Mumbai' },
            { id: 'branch-2', name: 'Uptown Express Counter', status: 'ACTIVE', city: 'Mumbai' },
          ],
        },
        {
          id: 'rest-2',
          name: 'Spice Villa Bistro',
          slug: 'spice-villa',
          cuisineTypes: ['NORTH_INDIAN', 'MUGHLAI'],
          status: 'ACTIVE',
          primaryContactName: 'Rahul Verma',
          primaryContactPhone: '+919812345678',
          branches: [
            { id: 'branch-3', name: 'Central Mall Food Court', status: 'ACTIVE', city: 'Pune' },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-slate-950 p-4 sm:p-8">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8 flex-wrap gap-4">
        <View>
          <View className="flex-row items-center space-x-3 mb-1">
            <Text className="text-3xl font-extrabold text-white tracking-tight">
              Restaurant Brands & Concepts
            </Text>
            <View className="bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              <Text className="text-xs font-bold text-amber-400">Multi-Concept Active</Text>
            </View>
          </View>
          <Text className="text-slate-400 text-sm">
            Manage your parent restaurant concepts, brand assets & branch networks
          </Text>
        </View>

        <TouchableOpacity
          className="bg-amber-500 hover:bg-amber-400 px-4 py-2.5 rounded-xl flex-row items-center space-x-2 shadow-lg shadow-amber-500/25"
          onPress={() => router.push('/(onboarding)/create-restaurant')}
        >
          <Ionicons name="add-circle" size={18} color="#0f172a" />
          <Text className="text-slate-950 font-extrabold text-xs">+ Register New Concept</Text>
        </TouchableOpacity>
      </View>

      {/* Brand Grid */}
      {loading ? (
        <View className="py-12 items-center">
          <ActivityIndicator size="large" color="#f59e0b" />
          <Text className="text-slate-400 text-xs mt-2">Loading brand portfolio...</Text>
        </View>
      ) : (
        <View className="flex-row flex-wrap gap-4">
          {restaurants.map((item) => (
            <Card
              key={item.id}
              className="flex-1 min-w-[320px] mb-2"
              glow="amber"
              title={item.name}
              subtitle={`Slug: /${item.slug} • Contact: ${item.primaryContactName}`}
            >
              <View className="flex-row justify-between items-center mb-4">
                <Badge label={item.status} variant={item.status} size="sm" />
                <Text className="text-xs font-bold text-amber-400">
                  {item.branches?.length || 1} Branch Location(s)
                </Text>
              </View>

              <View className="flex-row flex-wrap gap-1.5 mb-4">
                {item.cuisineTypes?.map((c: string) => (
                  <View
                    key={c}
                    className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-md"
                  >
                    <Text className="text-slate-300 text-xs font-semibold">
                      {c.replace('_', ' ')}
                    </Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                onPress={() => router.push(`/(owner)/restaurants/${item.id}`)}
                className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex-row justify-between items-center hover:border-amber-500/50"
              >
                <Text className="text-xs font-bold text-white">Manage Brand Settings & Branches</Text>
                <Ionicons name="chevron-forward" size={16} color="#f59e0b" />
              </TouchableOpacity>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
