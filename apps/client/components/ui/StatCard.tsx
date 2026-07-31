import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  iconName,
  iconColor = '#f59e0b',
  subtitle,
}) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  return (
    <View
      style={{
        backgroundColor: '#0f172a',
        borderWidth: 1,
        borderColor: '#1e293b',
        borderRadius: 16,
        padding: 16,
        width: isMobile ? '100%' : 'auto',
        minWidth: isMobile ? '100%' : 220,
        flex: 1,
        marginBottom: 12,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ fontSize: 11, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {title}
        </Text>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: `${iconColor}18`,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={iconName} size={18} color={iconColor} />
        </View>
      </View>

      <Text style={{ fontSize: isMobile ? 24 : 28, fontWeight: '800', color: '#ffffff', letterSpacing: -0.5 }}>
        {value}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(30, 41, 59, 0.6)' }}>
        {change && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 9999,
              marginRight: 8,
            }}
          >
            <Ionicons
              name={isPositive ? 'trending-up' : 'trending-down'}
              size={12}
              color={isPositive ? '#34d399' : '#fb7185'}
            />
            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                color: isPositive ? '#34d399' : '#fb7185',
                marginLeft: 3,
              }}
            >
              {change}
            </Text>
          </View>
        )}
        <Text style={{ fontSize: 11, color: '#64748b', flex: 1 }} numberOfLines={1}>
          {subtitle || 'vs previous period'}
        </Text>
      </View>
    </View>
  );
};
