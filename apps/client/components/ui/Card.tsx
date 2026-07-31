import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface CardProps {
  title?: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
  children: React.ReactNode;
  className?: string;
  glow?: 'amber' | 'indigo' | 'emerald' | 'none';
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  actionText,
  onAction,
  children,
  className = '',
  glow = 'none',
}) => {
  let glowClass = '';
  if (glow === 'amber') glowClass = 'shadow-lg shadow-amber-500/10 border-amber-500/20';
  if (glow === 'indigo') glowClass = 'shadow-lg shadow-indigo-500/10 border-indigo-500/20';
  if (glow === 'emerald') glowClass = 'shadow-lg shadow-emerald-500/10 border-emerald-500/20';

  return (
    <View
      className={`bg-slate-900/90 border border-slate-800 rounded-2xl p-5 mb-4 shadow-sm ${glowClass} ${className}`}
    >
      {(title || actionText) && (
        <View className="flex-row justify-between items-center mb-4 pb-3 border-b border-slate-800/80">
          <View className="flex-1 pr-2">
            {title && <Text className="text-lg font-bold text-slate-100 tracking-tight">{title}</Text>}
            {subtitle && <Text className="text-xs text-slate-400 mt-0.5">{subtitle}</Text>}
          </View>
          {actionText && onAction && (
            <TouchableOpacity
              onPress={onAction}
              className="bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700"
            >
              <Text className="text-xs font-semibold text-amber-400">{actionText}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {children}
    </View>
  );
};
