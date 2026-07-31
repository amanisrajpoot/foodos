import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MenuEditorScreen() {
  const { menuId } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-slate-50">
      <View className="p-8 pb-4">
        <Link href="/(owner)/menu" asChild>
          <TouchableOpacity className="flex-row items-center mb-4">
            <Ionicons name="arrow-back" size={20} color="#6366f1" />
            <Text className="text-indigo-600 font-medium ml-2">Back to Menus</Text>
          </TouchableOpacity>
        </Link>
        <Text className="text-3xl font-bold text-slate-800 tracking-tight">Edit Menu</Text>
        <Text className="text-slate-500 mt-1">Menu ID: {menuId}</Text>
      </View>

      <ScrollView className="flex-1 px-8">
        <View className="flex-row flex-wrap gap-4">
          <Link href={`/(owner)/menu/${menuId}/categories`} asChild>
            <TouchableOpacity className="bg-white p-6 rounded-3xl flex-1 min-w-[200px] border border-slate-100 shadow-sm">
              <View className="w-12 h-12 bg-indigo-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="list" size={24} color="#4f46e5" />
              </View>
              <Text className="text-xl font-bold text-slate-800">Categories</Text>
              <Text className="text-slate-500 mt-2">Manage menu categories and sorting</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href={`/(owner)/menu/${menuId}/items`} asChild>
            <TouchableOpacity className="bg-white p-6 rounded-3xl flex-1 min-w-[200px] border border-slate-100 shadow-sm">
              <View className="w-12 h-12 bg-orange-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="restaurant" size={24} color="#f97316" />
              </View>
              <Text className="text-xl font-bold text-slate-800">Items</Text>
              <Text className="text-slate-500 mt-2">Add or edit food and beverage items</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}
