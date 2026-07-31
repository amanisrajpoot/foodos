import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MenuCategoriesScreen() {
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
          <Text className="text-3xl font-bold text-slate-800 tracking-tight">Categories</Text>
        </View>
        <TouchableOpacity className="bg-indigo-600 px-6 py-3 rounded-full flex-row items-center shadow-sm">
          <Ionicons name="add" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Add Category</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-8">
        <View className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Ionicons name="menu" size={24} color="#cbd5e1" className="mr-4" />
            <Text className="text-xl font-semibold text-slate-800 ml-4">Starters</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="pencil" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>
        <View className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Ionicons name="menu" size={24} color="#cbd5e1" className="mr-4" />
            <Text className="text-xl font-semibold text-slate-800 ml-4">Mains</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="pencil" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
