import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MenuItemsScreen() {
  const { menuId } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-slate-50">
      <View className="p-8 pb-4 flex-row justify-between items-center">
        <View>
          <Link href={`/(owner)/menu/${menuId}`} asChild>
            <TouchableOpacity className="flex-row items-center mb-4">
              <Ionicons name="arrow-back" size={20} color="#6366f1" />
              <Text className="text-indigo-600 font-medium ml-2">Back to Menu</Text>
            </TouchableOpacity>
          </Link>
          <Text className="text-3xl font-bold text-slate-800 tracking-tight">Menu Items</Text>
        </View>
        <Link href={`/(owner)/menu/${menuId}/items/new`} asChild>
          <TouchableOpacity className="bg-orange-500 px-6 py-3 rounded-full flex-row items-center shadow-sm">
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Add Item</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <ScrollView className="flex-1 px-8">
        <Link href={`/(owner)/menu/${menuId}/items/item123`} asChild>
          <TouchableOpacity className="bg-white p-6 rounded-3xl mb-4 border border-slate-100 shadow-sm flex-row items-center justify-between active:bg-slate-50">
            <View className="flex-row items-center flex-1">
              <View className="w-16 h-16 bg-slate-100 rounded-xl mr-4"></View>
              <View>
                <Text className="text-xl font-bold text-slate-800">Margherita Pizza</Text>
                <Text className="text-sm text-slate-500 mt-1">₹399 • Veg</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </View>
  );
}
