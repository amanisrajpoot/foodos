import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ItemAvailabilityScreen() {
  const { menuId, itemId } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-slate-50">
      <View className="p-8 pb-4">
        <Link href={`/(owner)/menu/${menuId}/items/${itemId}`} asChild>
          <TouchableOpacity className="flex-row items-center mb-4">
            <Ionicons name="arrow-back" size={20} color="#6366f1" />
            <Text className="text-indigo-600 font-medium ml-2">Back to Item</Text>
          </TouchableOpacity>
        </Link>
        <Text className="text-3xl font-bold text-slate-800 tracking-tight">Availability</Text>
        <Text className="text-slate-500 mt-1">Manage manual overrides and schedules</Text>
      </View>

      <ScrollView className="flex-1 px-8">
        <View className="bg-white p-6 rounded-3xl mb-4 border border-slate-100 shadow-sm flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-bold text-slate-800">Item is Available</Text>
            <Text className="text-sm text-slate-500 mt-1">Toggle to manually mark as unavailable</Text>
          </View>
          <Switch value={true} trackColor={{ false: '#cbd5e1', true: '#4f46e5' }} />
        </View>

        <TouchableOpacity className="bg-indigo-50 p-4 rounded-2xl flex-row items-center justify-center mt-4 border border-indigo-100">
          <Ionicons name="calendar" size={20} color="#4f46e5" />
          <Text className="text-indigo-600 font-semibold ml-2">Add Schedule Rule</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
