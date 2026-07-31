import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { VictoryChart, VictoryTheme, VictoryBar, VictoryAxis, VictoryGroup } from 'victory-native';

const screenWidth = Dimensions.get('window').width;

export default function RevenueReport() {
  const weeklyData = [
    { x: 'Mon', y: 12 }, { x: 'Tue', y: 15 }, { x: 'Wed', y: 14 }, 
    { x: 'Thu', y: 18 }, { x: 'Fri', y: 25 }, { x: 'Sat', y: 35 }, { x: 'Sun', y: 30 }
  ];

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4 sm:p-8">
      <Text className="text-3xl font-bold text-slate-800 mb-6">Revenue Report</Text>
      
      <View className="flex-row flex-wrap gap-4 mb-6">
        <View className="bg-white p-6 rounded-xl border border-slate-200 flex-1 min-w-[200px]">
          <Text className="text-slate-500 font-medium mb-1">MTD Revenue</Text>
          <Text className="text-3xl font-bold text-slate-800">₹3,45,000</Text>
          <Text className="text-emerald-500 font-medium mt-2">+12% vs last month</Text>
        </View>
        
        <View className="bg-white p-6 rounded-xl border border-slate-200 flex-1 min-w-[200px]">
          <Text className="text-slate-500 font-medium mb-1">Avg Ticket</Text>
          <Text className="text-3xl font-bold text-slate-800">₹945.50</Text>
        </View>
      </View>

      <View className="bg-white p-4 rounded-xl border border-slate-200 mb-6">
        <Text className="text-lg font-semibold text-slate-700 mb-2">Revenue by Day (Current Week)</Text>
        <VictoryChart theme={VictoryTheme.material} width={screenWidth > 600 ? 500 : screenWidth - 60} height={250}>
          <VictoryAxis />
          <VictoryAxis dependentAxis tickFormat={(x) => `₹${x}k`} />
          <VictoryBar data={weeklyData} style={{ data: { fill: "#10b981" } }} />
        </VictoryChart>
      </View>
    </ScrollView>
  );
}
