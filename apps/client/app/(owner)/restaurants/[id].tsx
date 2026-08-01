import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../../services/api';
import { Ionicons } from '@expo/vector-icons';
import { ErrorState } from '../../../components/ui/ErrorState';

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
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
    setError(false);
    try {
      const res = await api.get(`/v1/restaurants/${id}`);
      setRestaurant(res.data);
      setName(res.data?.name || '');
      setContactName(res.data?.primaryContactName || '');
      setContactPhone(res.data?.primaryContactPhone || '');
    } catch (err) {
      console.error('Failed to fetch restaurant detail:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      await api.patch(`/v1/restaurants/${id}`, {
        name,
        primaryContactName: contactName,
        primaryContactPhone: contactPhone,
      });
      setEditing(false);
      fetchDetail();
    } catch (err) {
      console.error('Save error:', err);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-sm font-medium text-slate-400 mt-4">Loading Concept Profile...</Text>
      </View>
    );
  }

  if (error || !restaurant) {
    return (
      <View className="flex-1 bg-slate-950 p-6 sm:p-8">
        <ErrorState onRetry={fetchDetail} />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-950 p-6 sm:p-8">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-3xl font-extrabold text-white tracking-tight">{restaurant?.name}</Text>
          <Text className="text-slate-500 font-mono text-sm mt-1">ID: {id}</Text>
        </View>
        <TouchableOpacity
          className={`${editing ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30' : 'bg-slate-800 hover:bg-slate-700 border border-slate-700'} px-5 py-3 rounded-xl shadow-lg flex-row items-center gap-2`}
          onPress={() => (editing ? handleSave() : setEditing(true))}
        >
          <Ionicons name={editing ? "save-outline" : "pencil-outline"} size={16} color={editing ? "#ffffff" : "#cbd5e1"} />
          <Text className={`${editing ? 'text-white' : 'text-slate-200'} font-bold text-sm`}>{editing ? 'Save Changes' : 'Edit Concept'}</Text>
        </TouchableOpacity>
      </View>

      {/* Brand Profile Details */}
      <View className="bg-slate-900 p-6 rounded-[1.5rem] border border-slate-800 shadow-xl mb-8">
        <View className="flex-row items-center gap-2 mb-6">
          <Ionicons name="business-outline" size={20} color="#f8fafc" />
          <Text className="text-xl font-extrabold text-white">Brand Profile Configuration</Text>
        </View>

        <View className="space-y-5">
          <View>
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Concept Name</Text>
            {editing ? (
              <View className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3">
                <TextInput
                  className="text-slate-100 font-bold text-base outline-none"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#64748b"
                />
              </View>
            ) : (
              <Text className="text-slate-100 font-bold text-lg">{restaurant?.name}</Text>
            )}
          </View>

          <View className="flex-row gap-6 flex-wrap">
            <View className="flex-1 min-w-[200px]">
              <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Primary Contact Person</Text>
              {editing ? (
                <View className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3">
                  <TextInput
                    className="text-slate-100 font-bold text-base outline-none"
                    value={contactName}
                    onChangeText={setContactName}
                    placeholderTextColor="#64748b"
                  />
                </View>
              ) : (
                <Text className="text-slate-100 font-medium text-base">{restaurant?.primaryContactName || 'Not Set'}</Text>
              )}
            </View>

            <View className="flex-1 min-w-[200px]">
              <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Contact Phone</Text>
              {editing ? (
                <View className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3">
                  <TextInput
                    className="text-slate-100 font-bold text-base outline-none"
                    value={contactPhone}
                    onChangeText={setContactPhone}
                    placeholderTextColor="#64748b"
                  />
                </View>
              ) : (
                <Text className="text-slate-100 font-medium text-base">{restaurant?.primaryContactPhone || 'Not Set'}</Text>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Associated Branches */}
      <View className="bg-slate-900 p-6 rounded-[1.5rem] border border-slate-800 shadow-xl">
        <View className="flex-row justify-between items-center mb-6 flex-wrap gap-4">
          <View className="flex-row items-center gap-2">
            <Ionicons name="storefront-outline" size={20} color="#f8fafc" />
            <Text className="text-xl font-extrabold text-white">Branch Locations</Text>
          </View>
          <TouchableOpacity
            className="bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 px-4 py-2 rounded-xl flex-row items-center gap-1.5"
            onPress={() => router.push('/(onboarding)/create-branch')}
          >
            <Ionicons name="add" size={16} color="#818cf8" />
            <Text className="text-indigo-400 font-bold text-xs">Add New Branch</Text>
          </TouchableOpacity>
        </View>

        <View className="space-y-4">
          {(!restaurant?.branches || restaurant.branches.length === 0) ? (
            <View className="py-6 items-center">
              <Text className="text-slate-500 italic text-sm">No branches configured for this concept yet.</Text>
            </View>
          ) : (
            restaurant.branches.map((branch: any) => (
              <View key={branch.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex-row justify-between items-center flex-wrap gap-4 shadow-md">
                <View className="min-w-[200px]">
                  <Text className="text-lg font-extrabold text-white mb-1">{branch.name}</Text>
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="pricetag-outline" size={12} color="#64748b" />
                    <Text className="text-xs text-slate-500 font-mono uppercase">CODE: {branch.branchCode} • TYPE: {branch.branchType || 'N/A'}</Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-3">
                  <View className={`px-2.5 py-0.5 rounded-lg border ${branch.status === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                    <Text className={`text-[10px] font-extrabold uppercase tracking-wide ${branch.status === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'}`}>{branch.status}</Text>
                  </View>
                  <TouchableOpacity
                    className="bg-slate-800 border border-slate-700 hover:bg-slate-700 px-4 py-2 rounded-xl flex-row items-center gap-1.5"
                    onPress={() => router.push(`/(owner)/branches/${branch.id}` as any)}
                  >
                    <Text className="text-slate-300 font-bold text-xs">Manage</Text>
                    <Ionicons name="chevron-forward" size={14} color="#94a3b8" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
