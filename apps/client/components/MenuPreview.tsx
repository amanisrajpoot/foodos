import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MenuPreviewProps {
  branchId: string;
  channel: string;
  // In a real app, this would fetch from /menu/active/:branchId?channel=channel
}

export function MenuPreview({ branchId, channel }: MenuPreviewProps) {
  return (
    <View className="flex-1 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      <View className="bg-indigo-600 p-4 flex-row justify-between items-center">
        <Text className="text-white font-bold text-lg">Menu Preview</Text>
        <View className="bg-white/20 px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-semibold">{channel}</Text>
        </View>
      </View>
      
      <ScrollView className="flex-1 p-4 bg-slate-50">
        <View className="mb-6">
          <Text className="text-xl font-bold text-slate-800 mb-4">Starters</Text>
          
          <View className="bg-white p-4 rounded-2xl mb-3 border border-slate-100 shadow-sm flex-row">
            <View className="w-16 h-16 bg-slate-100 rounded-xl mr-4 items-center justify-center">
              <Ionicons name="restaurant" size={24} color="#cbd5e1" />
            </View>
            <View className="flex-1 justify-center">
              <View className="flex-row justify-between items-start">
                <Text className="text-lg font-bold text-slate-800">Paneer Tikka</Text>
                <Text className="text-indigo-600 font-bold text-lg">₹249</Text>
              </View>
              <Text className="text-sm text-slate-500 mt-1" numberOfLines={2}>
                Marinated cottage cheese cubes grilled to perfection
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
