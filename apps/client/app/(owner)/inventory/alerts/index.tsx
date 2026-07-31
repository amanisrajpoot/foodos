import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function AlertsList() {
  return (
    <View className="flex-1 bg-slate-50 p-6">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-bold text-slate-800">Inventory Alerts</Text>
      </View>
      <ScrollView className="space-y-4">
        <View className="bg-white rounded-xl border border-red-200 p-5 flex-row items-start gap-4">
          <View className="bg-red-100 p-3 rounded-full mt-1">
            <FontAwesome5 name="exclamation-triangle" size={16} color="#ef4444" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-slate-800 mb-1">Low Stock: Tomatoes (Fresh)</Text>
            <Text className="text-slate-600 mb-3">Current stock (2.5 kg) is below target threshold (20 kg).</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity className="bg-indigo-600 px-4 py-2 rounded-lg">
                <Text className="text-white font-medium text-sm">Create PO</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-slate-100 border border-slate-200 px-4 py-2 rounded-lg">
                <Text className="text-slate-700 font-medium text-sm">Dismiss</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
