import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function ReportsHub() {
  const router = useRouter();

  const reports = [
    { id: 'daily-summary', title: 'Daily Summary', desc: 'End-of-day operations summary and AI insights' },
    { id: 'revenue', title: 'Revenue', desc: 'Detailed breakdown of sales by day, week, month' },
    { id: 'orders', title: 'Orders', desc: 'Order volume, average prep time, cancellation rate' },
    { id: 'inventory', title: 'Inventory', desc: 'Stock usage, waste %, top consumed ingredients' },
    { id: 'staff', title: 'Staff', desc: 'Timesheets, payroll, tip distribution' },
    { id: 'export', title: 'Data Export', desc: 'Export reports as CSV or PDF for accounting' },
  ];

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4 sm:p-8">
      <Text className="text-3xl font-bold text-slate-800 mb-6">Reports Hub</Text>
      <View className="flex-row flex-wrap gap-4">
        {reports.map(report => (
          <TouchableOpacity 
            key={report.id}
            className="bg-white p-6 rounded-xl border border-slate-200 flex-1 min-w-[250px] shadow-sm active:bg-slate-50"
            onPress={() => router.push(`/(owner)/reports/${report.id}`)}
          >
            <Text className="text-xl font-bold text-slate-700 mb-2">{report.title}</Text>
            <Text className="text-slate-500">{report.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
