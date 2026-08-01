import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
// Removed cartStore as POS handles it via state or authStore if needed, but for simplicity we'll just redirect

export default function TableDetailScreen() {
  const { tableId } = useLocalSearchParams();
  const router = useRouter();

  const handleTakeOrder = () => {
    // In our new POS, the table can be selected there or we pass it
    // For now we'll route to new-order or POS. Since new-order exists, we can route there
    // but pass tableId in state. 
    router.push({ pathname: '/(staff)/new-order', params: { tableId, channel: 'DINE_IN' } });
  };

  return (
    <View className="flex-1 bg-slate-950 p-6">
      <View className="bg-slate-900 rounded-[1.5rem] p-6 shadow-xl border border-slate-800 flex-row items-center justify-between mb-8 z-10">
        <View>
          <Text className="text-3xl font-extrabold text-white tracking-tight">Table {tableId}</Text>
          <Text className="text-slate-400 font-bold uppercase tracking-wider text-xs mt-1">Manage Table Operations</Text>
        </View>
        <TouchableOpacity 
          className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl border border-slate-700 transition-all"
          onPress={() => router.back()}
        >
          <Text className="text-white font-extrabold tracking-wider uppercase text-xs">Back</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap gap-4">
        <TouchableOpacity 
          className="w-48 h-32 bg-amber-500 hover:bg-amber-400 rounded-[1.5rem] items-center justify-center shadow-lg shadow-amber-500/25 transition-all"
          onPress={handleTakeOrder}
        >
          <Text className="text-slate-950 font-black text-xl tracking-tight">Take Order</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="w-48 h-32 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 rounded-[1.5rem] items-center justify-center transition-all shadow-xl"
        >
          <Text className="text-white font-extrabold text-xl tracking-tight">Call Bill</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="w-48 h-32 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 rounded-[1.5rem] items-center justify-center transition-all shadow-xl"
        >
          <Text className="text-rose-400 font-extrabold text-xl tracking-tight">Clear Table</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
