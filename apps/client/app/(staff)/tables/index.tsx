import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../../services/api';
import { useAuthStore } from '../../../stores/auth.store';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Ionicons } from '@expo/vector-icons';

export default function TablesScreen() {
  const router = useRouter();
  const { branchId } = useAuthStore();
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchTables();
  }, [branchId]);

  async function fetchTables() {
    if (!branchId) return;
    setLoading(true);
    setError(false);
    try {
      const res = await api.get(`/restaurants/branches/${branchId}/tables`);
      setTables(res.data || []);
    } catch (err) {
      console.error('Failed to fetch tables:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10';
      case 'OCCUPIED': return 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-rose-500/10';
      case 'RESERVED': return 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-amber-500/10';
      default: return 'bg-slate-800 border-slate-700 text-slate-300 shadow-slate-900/50';
    }
  };

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
    <View className="flex-1 bg-slate-950">
      <View className="p-6 bg-slate-900 border-b border-slate-800 flex-row items-center justify-between shadow-xl z-10">
        <View>
          <Text className="text-3xl font-extrabold text-white tracking-tight">Dining Tables</Text>
          <Text className="text-slate-400 text-sm mt-0.5">Manage seating and view status</Text>
        </View>
        <TouchableOpacity 
          onPress={fetchTables}
          className="bg-slate-800 p-2.5 rounded-full border border-slate-700"
        >
          <Ionicons name="refresh" size={20} color="#cbd5e1" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-6">
        {tables.length === 0 ? (
           <EmptyState 
             icon="restaurant-outline" 
             title="No Tables Configured" 
             description="Tables have not been set up for this branch yet."
           />
        ) : (
          <View className="flex-row flex-wrap gap-4 pb-12">
            {tables.map(table => (
              <TouchableOpacity
                key={table.id}
                className={`w-[47%] sm:w-40 aspect-square rounded-[1.5rem] items-center justify-center border-2 shadow-xl hover:opacity-80 transition-all ${getStatusStyle(table.status)}`}
                onPress={() => router.push(`/(staff)/tables/${table.id}`)}
              >
                <Text className="text-3xl font-black text-white">{table.label}</Text>
                <Text className="text-[10px] font-bold uppercase tracking-widest mt-2">{table.status || 'AVAILABLE'}</Text>
                <Text className="text-[10px] font-medium text-slate-400 mt-1">{table.capacity} Seats</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
