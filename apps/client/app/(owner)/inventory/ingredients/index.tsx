import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

export default function IngredientsList() {
  return (
    <View className="flex-1 bg-slate-50 p-6">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-bold text-slate-800">Ingredients</Text>
        <Link href="/(owner)/inventory/ingredients/create" asChild>
          <TouchableOpacity className="bg-indigo-600 px-4 py-2 rounded-lg flex-row items-center gap-2">
            <FontAwesome5 name="plus" size={14} color="white" />
            <Text className="text-white font-medium">Add Ingredient</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <ScrollView className="bg-white rounded-xl border border-slate-200">
        <Link href="/(owner)/inventory/ingredients/1" asChild>
          <TouchableOpacity className="flex-row justify-between p-4 border-b border-slate-100 items-center">
            <View>
              <Text className="font-semibold text-slate-800">Tomatoes (Fresh)</Text>
              <Text className="text-slate-500 text-sm">Vegetables • In Stock: 2.5 kg</Text>
            </View>
            <FontAwesome5 name="chevron-right" size={14} color="#94a3b8" />
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </View>
  );
}
