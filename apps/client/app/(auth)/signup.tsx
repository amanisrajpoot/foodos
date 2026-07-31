import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center p-6 bg-slate-50">
      <View className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <Text className="text-2xl font-bold mb-6 text-slate-800">Create an Account</Text>
        
        <View className="mb-4">
          <Text className="text-slate-600 mb-2 font-medium">Full Name</Text>
          <TextInput 
            className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200" 
            placeholder="John Doe"
          />
        </View>

        <View className="mb-4">
          <Text className="text-slate-600 mb-2 font-medium">Email</Text>
          <TextInput 
            className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200" 
            placeholder="owner@foodos.app"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="mb-6">
          <Text className="text-slate-600 mb-2 font-medium">Password</Text>
          <TextInput 
            className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200" 
            placeholder="••••••••"
            secureTextEntry
          />
        </View>

        <Pressable 
          onPress={() => router.replace('/(auth)/login')}
          className="w-full bg-blue-600 p-4 rounded-xl items-center shadow-sm mb-4"
        >
          <Text className="text-white font-semibold text-lg">Sign Up</Text>
        </Pressable>
        
        <Pressable onPress={() => router.replace('/(auth)/login')}>
          <Text className="text-blue-600 text-center font-medium">Already have an account? Login</Text>
        </Pressable>
      </View>
    </View>
  );
}
