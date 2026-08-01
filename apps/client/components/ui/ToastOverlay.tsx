import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useToastStore, ToastType } from '../../stores/toast.store';

export { useToastStore, ToastType };

const getToastStyles = (type: ToastType) => {
  switch (type) {
    case 'error':
      return {
        bg: 'bg-rose-500/90',
        border: 'border-rose-500',
        icon: 'warning-outline',
        color: '#ffffff',
      };
    case 'success':
      return {
        bg: 'bg-emerald-500/90',
        border: 'border-emerald-500',
        icon: 'checkmark-circle-outline',
        color: '#ffffff',
      };
    case 'warning':
      return {
        bg: 'bg-amber-500/90',
        border: 'border-amber-500',
        icon: 'alert-circle-outline',
        color: '#0f172a',
      };
    default:
      return {
        bg: 'bg-slate-800/90',
        border: 'border-slate-700',
        icon: 'information-circle-outline',
        color: '#ffffff',
      };
  }
};

export function ToastOverlay() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <SafeAreaView
      style={{
        position: 'absolute',
        top: Platform.OS === 'web' ? 20 : 50,
        left: 0,
        right: 0,
        zIndex: 9999,
        alignItems: 'center',
        pointerEvents: 'box-none',
      }}
    >
      <View className="w-full max-w-md px-4 gap-2" pointerEvents="box-none">
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);
          const textColorClass = toast.type === 'warning' ? 'text-slate-900' : 'text-white';
          
          return (
            <TouchableOpacity
              key={toast.id}
              onPress={() => removeToast(toast.id)}
              activeOpacity={0.8}
              className={`${styles.bg} ${styles.border} border rounded-xl p-4 shadow-xl flex-row items-start`}
            >
              <Ionicons name={styles.icon as any} size={24} color={styles.color} style={{ marginRight: 12 }} />
              <View className="flex-1">
                <Text className={`${textColorClass} font-bold text-sm mb-0.5`}>{toast.title}</Text>
                {toast.message && (
                  <Text className={`${textColorClass} opacity-90 text-xs leading-relaxed`}>{toast.message}</Text>
                )}
              </View>
              <Ionicons name="close" size={20} color={styles.color} style={{ opacity: 0.6 }} />
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
