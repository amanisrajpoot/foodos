import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon?: any;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon = 'folder-open-outline', title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="flex-1 justify-center items-center p-8 bg-slate-900/50 rounded-3xl border border-slate-800/50 my-4">
      <View className="w-16 h-16 bg-slate-800 rounded-full justify-center items-center mb-4">
        <Ionicons name={icon} size={32} color="#94a3b8" />
      </View>
      <Text className="text-xl font-bold text-white mb-2 text-center">{title}</Text>
      {description && <Text className="text-sm text-slate-400 text-center mb-6 max-w-sm">{description}</Text>}
      
      {actionLabel && onAction && (
        <TouchableOpacity 
          onPress={onAction}
          className="bg-indigo-600 px-6 py-3 rounded-xl flex-row items-center"
        >
          <Text className="text-white font-bold">{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
