import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

export default function StockLotsList() {
  return (
    <View className="flex-1 bg-slate-50 p-6">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-bold text-slate-800">Stock Lots</Text>
        <Link href="/(owner)/inventory/stock/adjust" asChild>
          <TouchableOpacity className="bg-slate-800 px-4 py-2 rounded-lg flex-row items-center gap-2">
            <FontAwesome5 name="exchange-alt" size={14} color="white" />
            <Text className="text-white font-medium">Adjust Stock</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <ScrollView className="bg-white rounded-xl border border-slate-200">
        <View className="flex-row justify-between p-4 border-b border-slate-100 items-center">
          <View>
            <Text className="font-semibold text-slate-800">Tomatoes (Fresh)</Text>
            <Text className="text-slate-500 text-sm">Lot: LOT-001 • Expiry: 12 Aug 2026</Text>
          </View>
          <View className="items-end">
            <Text className="text-slate-800 font-bold">2.5 kg</Text>
            <Text className="text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded">AVAILABLE</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
