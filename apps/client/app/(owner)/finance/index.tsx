import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatCard } from '../../../components/ui/StatCard';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

const FINANCE_SUMMARY = {
  todayRevenue: 148920,
  ordersCount: 184,
  breakdown: [
    { method: 'UPI / QR CODE', amount: 84500, percentage: 57, count: 102 },
    { method: 'CREDIT / DEBIT CARD', amount: 42300, percentage: 28, count: 54 },
    { method: 'CASH ON DELIVERY', amount: 22120, percentage: 15, count: 28 },
  ],
};

export default function FinanceDashboard() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-slate-950 p-4 sm:p-8">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8 flex-wrap gap-4">
        <View>
          <View className="flex-row items-center space-x-3 mb-1">
            <Text className="text-3xl font-extrabold text-white tracking-tight">
              Finance & Ledger Center
            </Text>
            <View className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <Text className="text-xs font-bold text-emerald-400">Reconciled Today</Text>
            </View>
          </View>
          <Text className="text-slate-400 text-sm">
            Payment gateway payouts, cash audit logs, tax invoicing & GST statements
          </Text>
        </View>

        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={() => router.push('/(owner)/finance/invoices')}
            className="bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl hover:border-slate-700"
          >
            <Text className="text-xs font-bold text-slate-300">View Invoices →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(owner)/finance/payments')}
            className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/25"
          >
            <Text className="text-white font-bold text-xs">Payment Logs →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* KPI Stats Row */}
      <View className="flex-row flex-wrap gap-4 mb-8">
        <StatCard
          title="Today's Gross Sales"
          value={`₹${FINANCE_SUMMARY.todayRevenue.toLocaleString('en-IN')}`}
          change="+18.4%"
          isPositive={true}
          iconName="cash-outline"
          iconColor="#10b981"
          subtitle="Net after refunds"
        />
        <StatCard
          title="Total Settlements"
          value={`${FINANCE_SUMMARY.ordersCount} Paid`}
          change="100% captured"
          isPositive={true}
          iconName="checkmark-circle-outline"
          iconColor="#6366f1"
          subtitle="0 payment failures"
        />
        <StatCard
          title="Estimated GST Tax"
          value="₹7,446"
          change="5% SGST + CGST"
          isPositive={true}
          iconName="calculator-outline"
          iconColor="#f59e0b"
          subtitle="Auto-calculated tax pool"
        />
      </View>

      {/* Revenue Breakdown by Channel */}
      <Card title="Payment Gateway Breakdown" subtitle="Real-time channel settlement distribution" glow="emerald">
        <View className="gap-3">
          {FINANCE_SUMMARY.breakdown.map((item) => (
            <View
              key={item.method}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex-row justify-between items-center flex-wrap gap-2"
            >
              <View className="flex-1 min-w-[200px]">
                <View className="flex-row items-center space-x-2 mb-1">
                  <Text className="text-base font-bold text-white">{item.method}</Text>
                  <Badge label={`${item.count} Txns`} variant="ACTIVE" size="sm" />
                </View>
                <View className="flex-row items-center space-x-3">
                  <View className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </View>
                  <Text className="text-xs font-bold text-slate-400">{item.percentage}%</Text>
                </View>
              </View>

              <Text className="text-xl font-extrabold text-emerald-400">
                ₹{item.amount.toLocaleString('en-IN')}
              </Text>
            </View>
          ))}
        </View>
      </Card>
    </ScrollView>
  );
}
