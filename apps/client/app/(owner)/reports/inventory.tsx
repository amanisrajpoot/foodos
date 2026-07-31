import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { VictoryPie } from 'victory-native';

const screenWidth = Dimensions.get('window').width;

export default function InventoryReport() {
  const wasteData = [
    { x: 'Spoilage', y: 45 },
    { x: 'Prep Waste', y: 30 },
    { x: 'Errors', y: 25 }
  ];

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4 sm:p-8">
      <Text className="text-3xl font-bold text-slate-800 mb-6">Inventory Analytics</Text>
      
      <View className="flex-row flex-wrap gap-4 mb-6">
        <View className="bg-white p-6 rounded-xl border border-slate-200 flex-1 min-w-[200px]">
          <Text className="text-slate-500 font-medium mb-1">Food Cost (%)</Text>
          <Text className="text-3xl font-bold text-slate-800">28.5%</Text>
          <Text className="text-emerald-500 font-medium mt-2">-1.2% vs last month</Text>
        </View>
        <View className="bg-white p-6 rounded-xl border border-slate-200 flex-1 min-w-[200px]">
          <Text className="text-slate-500 font-medium mb-1">Waste Ratio</Text>
          <Text className="text-3xl font-bold text-slate-800">3.2%</Text>
          <Text className="text-rose-500 font-medium mt-2">+0.5% vs last month</Text>
        </View>
      </View>

      <View className="bg-white p-4 rounded-xl border border-slate-200 mb-6 items-center">
        <Text className="text-lg font-semibold text-slate-700 mb-2 self-start">Waste Breakdown</Text>
        <VictoryPie
          data={wasteData}
          width={300}
          height={250}
          colorScale={["#f43f5e", "#f59e0b", "#6366f1"]}
          innerRadius={60}
          labelRadius={80}
          style={{ labels: { fill: "white", fontSize: 12, fontWeight: "bold" } }}
        />
      </View>
    </ScrollView>
  );
}
