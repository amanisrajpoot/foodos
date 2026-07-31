import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../../services/api';

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  useEffect(() => {
    fetchDetail();
  }, [id]);

  async function fetchDetail() {
    setLoading(true);
    try {
      const res = await api.get(`/restaurants/${id}`);
      setRestaurant(res.data);
      setName(res.data?.name || '');
      setContactName(res.data?.primaryContactName || '');
      setContactPhone(res.data?.primaryContactPhone || '');
    } catch (err) {
      console.log('Failed to fetch restaurant detail, using mock data');
      const mock = {
        id,
        name: 'Burger Palace',
        slug: 'burger-palace',
        cuisineTypes: ['FAST_FOOD', 'BURGERS'],
        status: 'ACTIVE',
        primaryContactName: 'John Owner',
        primaryContactPhone: '+919876543210',
        primaryContactEmail: 'owner@burgerpalace.com',
        branches: [
          { id: 'branch-1', name: 'Downtown Branch', branchCode: 'BR-001', branchType: 'HYBRID', status: 'ACTIVE' },
          { id: 'branch-2', name: 'Westside Cloud Kitchen', branchCode: 'BR-002', branchType: 'CLOUD_KITCHEN', status: 'ACTIVE' },
        ],
      };
      setRestaurant(mock);
      setName(mock.name);
      setContactName(mock.primaryContactName);
      setContactPhone(mock.primaryContactPhone);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      await api.patch(`/restaurants/${id}`, {
        name,
        primaryContactName: contactName,
        primaryContactPhone: contactPhone,
      });
      setEditing(false);
      fetchDetail();
    } catch (err) {
      console.log('Save error', err);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4 sm:p-8">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-3xl font-bold text-slate-800">{restaurant?.name}</Text>
          <Text className="text-slate-500 font-mono">ID: {id}</Text>
        </View>
        <TouchableOpacity
          className="bg-blue-600 px-4 py-2 rounded-xl"
          onPress={() => (editing ? handleSave() : setEditing(true))}
        >
          <Text className="text-white font-semibold text-sm">{editing ? 'Save Changes' : 'Edit Brand'}</Text>
        </TouchableOpacity>
      </View>

      {/* Brand Profile Details */}
      <View className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <Text className="text-xl font-bold text-slate-800 mb-4">Brand Concept Configuration</Text>

        <View className="space-y-4">
          <View>
            <Text className="text-slate-500 text-xs font-semibold uppercase mb-1">Brand Name</Text>
            {editing ? (
              <TextInput
                className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-800 font-medium"
                value={name}
                onChangeText={setName}
              />
            ) : (
              <Text className="text-slate-800 font-semibold text-base">{restaurant?.name}</Text>
            )}
          </View>

          <View className="flex-row gap-6">
            <View className="flex-1">
              <Text className="text-slate-500 text-xs font-semibold uppercase mb-1">Primary Contact Person</Text>
              {editing ? (
                <TextInput
                  className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-800"
                  value={contactName}
                  onChangeText={setContactName}
                />
              ) : (
                <Text className="text-slate-800 font-medium">{restaurant?.primaryContactName || 'N/A'}</Text>
              )}
            </View>

            <View className="flex-1">
              <Text className="text-slate-500 text-xs font-semibold uppercase mb-1">Contact Phone</Text>
              {editing ? (
                <TextInput
                  className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-800"
                  value={contactPhone}
                  onChangeText={setContactPhone}
                />
              ) : (
                <Text className="text-slate-800 font-medium">{restaurant?.primaryContactPhone || 'N/A'}</Text>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Associated Branches */}
      <View className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-slate-800">Branch Locations</Text>
          <TouchableOpacity
            className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200"
            onPress={() => router.push('/(onboarding)/create-branch')}
          >
            <Text className="text-slate-700 font-medium text-xs">+ Add Branch</Text>
          </TouchableOpacity>
        </View>

        <View className="space-y-3">
          {restaurant?.branches?.map((branch: any) => (
            <View key={branch.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex-row justify-between items-center">
              <View>
                <Text className="text-base font-bold text-slate-800">{branch.name}</Text>
                <Text className="text-xs text-slate-500 font-mono">Code: {branch.branchCode} • Type: {branch.branchType}</Text>
              </View>

              <View className="flex-row items-center gap-3">
                <View className="bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  <Text className="text-emerald-800 text-xs font-bold">{branch.status}</Text>
                </View>
                <TouchableOpacity
                  className="bg-white px-3 py-1.5 border border-slate-200 rounded-lg"
                  onPress={() => router.push(`/(owner)/branches/${branch.id}` as any)}
                >
                  <Text className="text-slate-700 text-xs font-medium">Manage →</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
