import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  return (
    <View className="flex-1 bg-slate-950 items-center justify-center">
      <ActivityIndicator size="large" color="#f59e0b" />
    </View>
  );
}
