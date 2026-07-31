import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { api } from '../../../services/api';

export default function ExportReports() {
  const [loading, setLoading] = useState(false);

  const handleExportCSV = async () => {
    setLoading(true);
    try {
      // Simulate API call for CSV data
      // const res = await api.get('/analytics/export?format=csv', { responseType: 'blob' });
      await new Promise(resolve => setTimeout(resolve, 1000));
      const dummyCsvData = "Date,Revenue,Orders\n2023-10-01,12000,105\n2023-10-02,13500,120\n";

      if (Platform.OS === 'web') {
        const blob = new Blob([dummyCsvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'foodos-export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        Alert.alert("Export Successful", "CSV data generated. (Share functionality pending for mobile)");
      }
    } catch (err) {
      Alert.alert("Export Failed", "Could not generate CSV.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4 sm:p-8">
      <Text className="text-3xl font-bold text-slate-800 mb-6">Data Export</Text>
      
      <View className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-md">
        <Text className="text-slate-600 text-lg mb-4">
          Select a format to export all your business data for the current month.
        </Text>
        
        <View className="flex-col gap-4 mt-4">
          <TouchableOpacity 
            className={`bg-indigo-600 p-4 rounded-xl items-center shadow-sm ${loading ? 'opacity-50' : ''}`}
            onPress={handleExportCSV}
            disabled={loading}
          >
            <Text className="text-white font-bold text-lg">{loading ? 'Generating...' : 'Export as CSV'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-rose-500 p-4 rounded-xl items-center shadow-sm opacity-50" disabled>
            <Text className="text-white font-bold text-lg">Export as PDF (Coming Soon)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
