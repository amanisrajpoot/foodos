import React from 'react';
import { View, Text, TouchableOpacity, Modal as RNModal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-slate-950/80 justify-center items-center p-4">
        <View className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
          {/* Modal Header */}
          <View className="flex-row justify-between items-center mb-4 pb-3 border-b border-slate-800">
            <View>
              <Text className="text-xl font-bold text-white">{title}</Text>
              {subtitle && <Text className="text-xs text-slate-400 mt-0.5">{subtitle}</Text>}
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 items-center justify-center"
            >
              <Ionicons name="close" size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <View className="py-2">{children}</View>
        </View>
      </View>
    </RNModal>
  );
};
