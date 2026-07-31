import React from 'react';
import { View, Text } from 'react-native';
import { getStatusBadgeStyle } from '../../lib/theme';

interface BadgeProps {
  label: string;
  variant?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant, size = 'md' }) => {
  const style = getStatusBadgeStyle(variant || label);
  const paddingClass = size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1';
  const textClass = size === 'sm' ? 'text-[10px]' : 'text-xs';

  return (
    <View
      className={`flex-row items-center rounded-full border ${style.bg} ${style.border} ${paddingClass} align-self-start`}
    >
      <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${style.dot}`} />
      <Text className={`font-semibold tracking-wide ${style.text} ${textClass}`}>
        {(label || '').toUpperCase()}
      </Text>
    </View>
  );
};
