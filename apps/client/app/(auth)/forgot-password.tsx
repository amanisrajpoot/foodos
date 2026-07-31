import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center p-6 bg-slate-50">
      <View className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <Text className="text-2xl font-bold mb-2 text-slate-800">Reset Password</Text>
        <Text className="text-slate-500 mb-6">Enter your email and we will send you a reset link.</Text>
        
        <View className="mb-6">
          <Text className="text-slate-600 mb-2 font-medium">Email</Text>
          <TextInput 
            className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200" 
            placeholder="owner@foodos.app"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Pressable 
          className="w-full bg-blue-600 p-4 rounded-xl items-center shadow-sm mb-4"
        >
          <Text className="text-white font-semibold text-lg">Send Reset Link</Text>
        </Pressable>
        
        <Pressable onPress={() => router.replace('/(auth)/login')}>
          <Text className="text-blue-600 text-center font-medium">Back to Login</Text>
        </Pressable>
      </View>
    </View>
  );
}
