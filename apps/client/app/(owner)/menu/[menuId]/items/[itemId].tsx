import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MenuItemEditorScreen() {
  const { menuId, itemId } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-slate-50">
      <View className="p-8 pb-4">
        <Link href={`/(owner)/menu/${menuId}/items`} asChild>
          <TouchableOpacity className="flex-row items-center mb-4">
            <Ionicons name="arrow-back" size={20} color="#6366f1" />
            <Text className="text-indigo-600 font-medium ml-2">Back to Items</Text>
          </TouchableOpacity>
        </Link>
        <Text className="text-3xl font-bold text-slate-800 tracking-tight">Edit Item</Text>
        <Text className="text-slate-500 mt-1">Item ID: {itemId}</Text>
      </View>

      <ScrollView className="flex-1 px-8">
        <View className="flex-row flex-wrap gap-4">
          <Link href={`/(owner)/menu/${menuId}/items/${itemId}/modifiers`} asChild>
            <TouchableOpacity className="bg-white p-6 rounded-3xl flex-1 min-w-[150px] border border-slate-100 shadow-sm">
              <View className="w-12 h-12 bg-pink-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="options" size={24} color="#db2777" />
              </View>
              <Text className="text-xl font-bold text-slate-800">Modifiers</Text>
              <Text className="text-slate-500 mt-2">Add-ons, sizes, options</Text>
            </TouchableOpacity>
          </Link>

          <Link href={`/(owner)/menu/${menuId}/items/${itemId}/pricing`} asChild>
            <TouchableOpacity className="bg-white p-6 rounded-3xl flex-1 min-w-[150px] border border-slate-100 shadow-sm">
              <View className="w-12 h-12 bg-emerald-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="pricetag" size={24} color="#059669" />
              </View>
              <Text className="text-xl font-bold text-slate-800">Pricing</Text>
              <Text className="text-slate-500 mt-2">Branch & Channel overrides</Text>
            </TouchableOpacity>
          </Link>

          <Link href={`/(owner)/menu/${menuId}/items/${itemId}/availability`} asChild>
            <TouchableOpacity className="bg-white p-6 rounded-3xl flex-1 min-w-[150px] border border-slate-100 shadow-sm">
              <View className="w-12 h-12 bg-cyan-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="time" size={24} color="#0891b2" />
              </View>
              <Text className="text-xl font-bold text-slate-800">Availability</Text>
              <Text className="text-slate-500 mt-2">Schedules & Toggles</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}
