import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string | null;
  glowColor?: 'amber' | 'indigo' | 'emerald' | 'blue';
  required?: boolean;
}

export function FormInput({ label, error, glowColor = 'amber', required, ...props }: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const getFocusStyle = () => {
    if (error) return 'border-rose-500 shadow-rose-500/20 shadow-lg';
    if (!isFocused) return 'border-slate-800';
    
    switch (glowColor) {
      case 'amber': return 'border-amber-500 shadow-amber-500/20 shadow-lg';
      case 'indigo': return 'border-indigo-500 shadow-indigo-500/20 shadow-lg';
      case 'emerald': return 'border-emerald-500 shadow-emerald-500/20 shadow-lg';
      case 'blue': return 'border-blue-500 shadow-blue-500/20 shadow-lg';
      default: return 'border-slate-600';
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
        {label} {required && <Text className="text-rose-500">*</Text>}
      </Text>
      <View
        className={`bg-slate-950 rounded-xl border ${getFocusStyle()}`}
        style={{ overflow: 'hidden' }}
      >
        <TextInput
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className="p-3.5 text-slate-100 text-sm"
          placeholderTextColor="#64748b"
        />
      </View>
      {error && (
        <Text className="text-rose-500 text-xs mt-1.5 font-medium px-1">
          {error}
        </Text>
      )}
    </View>
  );
}
