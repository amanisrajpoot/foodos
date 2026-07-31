import React from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function StaffInventoryView() {
  return (
    <View className="flex-1 bg-slate-50 p-6">
      <Text className="text-3xl font-bold text-slate-800 mb-6">Quick Stock Check</Text>
      
      <View className="bg-white flex-row items-center rounded-lg border border-slate-200 px-4 mb-6">
        <FontAwesome5 name="search" size={16} color="#94a3b8" />
        <TextInput 
          className="flex-1 p-3 text-slate-800" 
          placeholder="Search ingredients..." 
          placeholderTextColor="#94a3b8"
        />
      </View>

      <ScrollView className="bg-white rounded-xl border border-slate-200">
        <View className="flex-row justify-between p-5 border-b border-slate-100 items-center">
          <View>
            <Text className="font-bold text-lg text-slate-800">Tomatoes (Fresh)</Text>
            <Text className="text-slate-500">Vegetables</Text>
          </View>
          <View className="bg-red-50 border border-red-200 px-4 py-2 rounded-lg items-center">
            <Text className="text-red-700 font-bold text-xl">2.5 kg</Text>
            <Text className="text-red-600 text-xs font-medium">LOW</Text>
          </View>
        </View>
        
        <View className="flex-row justify-between p-5 border-b border-slate-100 items-center">
          <View>
            <Text className="font-bold text-lg text-slate-800">Mozzarella Cheese</Text>
            <Text className="text-slate-500">Dairy</Text>
          </View>
          <View className="bg-green-50 border border-green-200 px-4 py-2 rounded-lg items-center">
            <Text className="text-green-700 font-bold text-xl">15 kg</Text>
            <Text className="text-green-600 text-xs font-medium">GOOD</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
