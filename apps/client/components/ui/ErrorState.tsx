import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = 'Something went wrong', 
  message = 'We could not load the data at this time.', 
  onRetry 
}: ErrorStateProps) {
  return (
    <View className="flex-1 justify-center items-center p-8 bg-rose-500/5 border border-rose-500/20 rounded-3xl my-4">
      <View className="w-16 h-16 bg-rose-500/10 rounded-full justify-center items-center mb-4">
        <Ionicons name="alert-circle-outline" size={32} color="#f43f5e" />
      </View>
      <Text className="text-xl font-bold text-white mb-2 text-center">{title}</Text>
      <Text className="text-sm text-slate-400 text-center mb-6 max-w-sm">{message}</Text>
      
      {onRetry && (
        <TouchableOpacity 
          onPress={onRetry}
          className="bg-slate-800 border border-slate-700 px-6 py-3 rounded-xl flex-row items-center"
        >
          <Ionicons name="refresh" size={18} color="#f1f5f9" style={{ marginRight: 8 }} />
          <Text className="text-white font-bold">Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
