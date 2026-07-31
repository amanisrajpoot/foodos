import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { VictoryChart, VictoryTheme, VictoryLine, VictoryAxis, VictoryPie } from 'victory-native';

const screenWidth = Dimensions.get('window').width;

export default function OrdersReport() {
  const cancellationData = [
    { x: 'Week 1', y: 4 }, { x: 'Week 2', y: 3 }, { x: 'Week 3', y: 5 }, { x: 'Week 4', y: 2 }
  ];

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4 sm:p-8">
      <Text className="text-3xl font-bold text-slate-800 mb-6">Orders Analytics</Text>
      
      <View className="flex-row flex-wrap gap-4 mb-6">
        <View className="bg-white p-6 rounded-xl border border-slate-200 flex-1 min-w-[200px]">
          <Text className="text-slate-500 font-medium mb-1">Total Orders (MTD)</Text>
          <Text className="text-3xl font-bold text-slate-800">3,240</Text>
        </View>
        <View className="bg-white p-6 rounded-xl border border-slate-200 flex-1 min-w-[200px]">
          <Text className="text-slate-500 font-medium mb-1">Avg Prep Time</Text>
          <Text className="text-3xl font-bold text-slate-800">14m</Text>
          <Text className="text-emerald-500 font-medium mt-2">-2m vs last month</Text>
        </View>
      </View>

      <View className="bg-white p-4 rounded-xl border border-slate-200 mb-6">
        <Text className="text-lg font-semibold text-slate-700 mb-2">Cancellation Trend (%)</Text>
        <VictoryChart theme={VictoryTheme.material} width={screenWidth > 600 ? 500 : screenWidth - 60} height={250}>
          <VictoryAxis />
          <VictoryAxis dependentAxis tickFormat={(x) => `${x}%`} />
          <VictoryLine data={cancellationData} style={{ data: { stroke: "#f43f5e", strokeWidth: 3 } }} />
        </VictoryChart>
      </View>
    </ScrollView>
  );
}
