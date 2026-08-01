import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { api } from '../../../services/api';
import { useAuthStore } from '../../../stores/auth.store';
import { Ionicons } from '@expo/vector-icons';

export default function ExportReports() {
  const organizationId = useAuthStore(state => state.organizationId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleExportCSV = async () => {
    if (!organizationId) return;
    setLoading(true);
    setError(false);
    try {
      const res = await api.get(`/v1/analytics/export?format=csv&organizationId=${organizationId}`, { responseType: 'blob' });
      const csvData = res.data;

      if (Platform.OS === 'web') {
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'foodos-export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        Alert.alert("Export Successful", "CSV data generated.");
      }
    } catch (err) {
      console.error("Export Failed", err);
      setError(true);
      if (Platform.OS !== 'web') {
        Alert.alert("Export Failed", "Could not generate CSV.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-950 p-6 sm:p-8">
      {/* Header */}
      <View className="mb-8">
        <Text className="text-3xl font-extrabold text-white tracking-tight mb-2">Data Export</Text>
        <Text className="text-slate-400 text-sm">Download business performance data for external analysis</Text>
      </View>
      
      <View className="bg-slate-900 p-8 rounded-[1.5rem] border border-slate-800 shadow-xl max-w-md">
        <View className="flex-row items-center gap-3 mb-4">
          <Ionicons name="cloud-download-outline" size={24} color="#6366f1" />
          <Text className="text-white font-bold text-xl">Export Options</Text>
        </View>

        <Text className="text-slate-400 text-sm leading-relaxed mb-8">
          Select a format to export all your business data for the current month. The system will compile orders, inventory changes, and revenue stats.
        </Text>
        
        {error && (
          <View className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-lg mb-6">
            <Text className="text-rose-400 text-xs text-center font-semibold">Failed to generate export. Please try again later.</Text>
          </View>
        )}

        <View className="flex-col gap-4">
          <TouchableOpacity 
            className={`bg-indigo-600 hover:bg-indigo-500 p-4 rounded-xl flex-row justify-center items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all ${loading ? 'opacity-50' : ''}`}
            onPress={handleExportCSV}
            disabled={loading}
          >
            {loading ? <Ionicons name="refresh" size={18} color="#ffffff" /> : <Ionicons name="document-text-outline" size={18} color="#ffffff" />}
            <Text className="text-white font-bold text-sm">{loading ? 'Generating CSV...' : 'Export as CSV'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-slate-800 p-4 rounded-xl flex-row justify-center items-center gap-2 shadow-sm opacity-60" disabled>
            <Ionicons name="document-outline" size={18} color="#94a3b8" />
            <Text className="text-slate-400 font-bold text-sm">Export as PDF (Coming Soon)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
