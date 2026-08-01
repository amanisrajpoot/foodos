import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { api } from '../../../../services/api';
import { Ionicons } from '@expo/vector-icons';
import { ErrorState } from '../../../../components/ui/ErrorState';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { useAuthStore } from '../../../../stores/auth.store';

export default function DiningTablesManagerScreen() {
  const { id } = useLocalSearchParams();
  const organizationId = useAuthStore(state => state.organizationId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tables, setTables] = useState<any[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [newSection, setNewSection] = useState('Main Hall');
  const [newCapacity, setNewCapacity] = useState('4');

  useEffect(() => {
    fetchTables();
  }, [id]);

  async function fetchTables() {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get(`/v1/restaurants/branches/${id}/tables`);
      setTables(res.data || []);
    } catch (err) {
      console.error('Failed to fetch tables:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTable() {
    if (!newLabel || !organizationId) return;
    try {
      const newTable = {
        label: newLabel,
        section: newSection,
        capacity: parseInt(newCapacity, 10) || 4,
      };
      await api.post(`/v1/restaurants/branches/${id}/tables`, {
        organizationId,
        tables: [newTable],
      });
      setNewLabel('');
      fetchTables();
    } catch (err) {
      console.error('Failed to add table:', err);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-sm font-medium text-slate-400 mt-4">Loading Floorplan...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-950 p-6 sm:p-8">
        <ErrorState onRetry={fetchTables} />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-950 p-6 sm:p-8">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8 flex-wrap gap-4">
        <View>
          <Text className="text-3xl font-extrabold text-white tracking-tight">Dining Floorplan & Tables</Text>
          <Text className="text-slate-400 text-sm mt-1">Manage dining room layout, table capacities, and QR codes</Text>
        </View>
      </View>

      {/* Add New Table Form */}
      <View className="bg-slate-900 p-6 rounded-[1.5rem] border border-slate-800 shadow-xl mb-8">
        <View className="flex-row items-center gap-2 mb-4">
          <Ionicons name="add-circle-outline" size={20} color="#f8fafc" />
          <Text className="text-lg font-extrabold text-white">Add New Dining Table</Text>
        </View>
        <View className="flex-row gap-4 flex-wrap items-end">
          <View className="flex-1 min-w-[120px]">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Table Label</Text>
            <View className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3">
              <TextInput
                className="text-slate-100 font-bold text-base outline-none"
                placeholder="e.g. T-05"
                placeholderTextColor="#64748b"
                value={newLabel}
                onChangeText={setNewLabel}
              />
            </View>
          </View>
          <View className="flex-1 min-w-[140px]">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Section / Floor</Text>
            <View className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3">
              <TextInput
                className="text-slate-100 font-bold text-base outline-none"
                placeholder="Main Hall"
                placeholderTextColor="#64748b"
                value={newSection}
                onChangeText={setNewSection}
              />
            </View>
          </View>
          <View className="flex-1 min-w-[100px]">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Capacity</Text>
            <View className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3">
              <TextInput
                className="text-slate-100 font-bold text-base outline-none"
                placeholder="4"
                placeholderTextColor="#64748b"
                value={newCapacity}
                onChangeText={setNewCapacity}
                keyboardType="number-pad"
              />
            </View>
          </View>
          <TouchableOpacity
            className={`px-6 py-4 rounded-xl shadow-lg flex-row items-center justify-center ${newLabel ? 'bg-indigo-600 shadow-indigo-600/25 hover:bg-indigo-500' : 'bg-slate-800'}`}
            onPress={handleAddTable}
            disabled={!newLabel}
          >
            <Text className={`font-extrabold text-sm ${newLabel ? 'text-white' : 'text-slate-500'}`}>Add Table</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Floorplan Tables Grid */}
      {tables.length === 0 ? (
        <EmptyState 
          icon="restaurant-outline" 
          title="No Tables Configured" 
          description="Add a table above to start managing your floorplan."
        />
      ) : (
        <View className="flex-row flex-wrap gap-5">
          {tables.map(tbl => (
            <View key={tbl.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl min-w-[220px] flex-1">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-2xl font-extrabold text-white">{tbl.label}</Text>
                <View className={`px-2.5 py-0.5 rounded-lg border ${
                  tbl.status === 'AVAILABLE' ? 'bg-emerald-500/10 border-emerald-500/30' : 
                  tbl.status === 'OCCUPIED' ? 'bg-rose-500/10 border-rose-500/30' : 
                  'bg-amber-500/10 border-amber-500/30'
                }`}>
                  <Text className={`text-[10px] font-extrabold ${
                    tbl.status === 'AVAILABLE' ? 'text-emerald-400' : 
                    tbl.status === 'OCCUPIED' ? 'text-rose-400' : 
                    'text-amber-400'
                  }`}>
                    {tbl.status}
                  </Text>
                </View>
              </View>

              <Text className="text-xs text-slate-500 mb-1">SECTION: <Text className="font-bold text-slate-300">{tbl.section}</Text></Text>
              <Text className="text-xs text-slate-500 mb-4">CAPACITY: <Text className="font-bold text-slate-300">{tbl.capacity} Persons</Text></Text>

              <View className="pt-4 border-t border-slate-800/80 flex-row items-center gap-2">
                <Ionicons name="qr-code-outline" size={14} color="#6366f1" />
                <Text className="text-xs font-mono font-medium text-indigo-400">{tbl.qrCode || `QR-${tbl.label}`}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
