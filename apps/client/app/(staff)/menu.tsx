import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function POSMenuScreen() {
  return (
    <View className="flex-1 bg-slate-100 flex-row">
      {/* Category Sidebar */}
      <View className="w-1/4 bg-white border-r border-slate-200">
        <View className="p-6 pb-4">
          <Text className="text-2xl font-bold text-slate-800">Categories</Text>
        </View>
        <ScrollView className="flex-1 px-4">
          <TouchableOpacity className="bg-indigo-50 p-4 rounded-2xl mb-2 flex-row items-center">
            <Text className="text-indigo-600 font-bold text-lg">All Items</Text>
          </TouchableOpacity>
          <TouchableOpacity className="p-4 rounded-2xl mb-2 flex-row items-center">
            <Text className="text-slate-600 font-semibold text-lg">Starters</Text>
          </TouchableOpacity>
          <TouchableOpacity className="p-4 rounded-2xl mb-2 flex-row items-center">
            <Text className="text-slate-600 font-semibold text-lg">Mains</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Item Grid */}
      <View className="flex-1 bg-slate-50">
        <View className="p-6 pb-4 flex-row justify-between items-center bg-white border-b border-slate-200">
          <Text className="text-2xl font-bold text-slate-800">Starters</Text>
          <View className="flex-row items-center bg-slate-100 rounded-full px-4 py-2">
            <Ionicons name="search" size={20} color="#64748b" />
            <Text className="text-slate-500 ml-2 font-medium">Search items...</Text>
          </View>
        </View>

        <ScrollView className="flex-1 p-6">
          <View className="flex-row flex-wrap gap-4">
            {/* POS Item Card */}
            <TouchableOpacity className="bg-white p-4 rounded-3xl w-[30%] min-w-[160px] border border-slate-200 shadow-sm active:scale-95 transition-transform">
              <View className="h-32 bg-slate-100 rounded-2xl mb-4 items-center justify-center">
                <Ionicons name="fast-food" size={40} color="#cbd5e1" />
              </View>
              <Text className="text-lg font-bold text-slate-800" numberOfLines={2}>French Fries</Text>
              <Text className="text-indigo-600 font-bold text-lg mt-2">₹149</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white p-4 rounded-3xl w-[30%] min-w-[160px] border border-slate-200 shadow-sm active:scale-95 transition-transform">
              <View className="h-32 bg-slate-100 rounded-2xl mb-4 items-center justify-center">
                <Ionicons name="fast-food" size={40} color="#cbd5e1" />
              </View>
              <Text className="text-lg font-bold text-slate-800" numberOfLines={2}>Paneer Tikka</Text>
              <Text className="text-indigo-600 font-bold text-lg mt-2">₹249</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
