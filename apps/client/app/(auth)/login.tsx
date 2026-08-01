import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../../stores/auth.store';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';

export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      // We don't need to route manually. _layout.tsx observes `isAuthenticated` and routes for us automatically based on role!
    } catch (err) {
      setError('Invalid credentials, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-950 px-4 sm:px-8 py-10 content-center justify-center">
      <View className="max-w-md mx-auto w-full pt-16">
        {/* Brand Header */}
        <View className="items-center mb-12">
          <View className="w-20 h-20 bg-amber-500 rounded-[2rem] items-center justify-center shadow-2xl shadow-amber-500/40 mb-6">
            <Ionicons name="restaurant" size={40} color="#0f172a" />
          </View>
          <Text className="text-4xl font-extrabold text-white tracking-tight">
            Food<Text className="text-amber-400">OS</Text>
          </Text>
          <Text className="text-sm font-bold text-slate-400 tracking-widest uppercase mt-2">
            Enterprise Cloud
          </Text>
        </View>

        {/* Login Card */}
        <View className="bg-slate-900/80 p-8 rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Subtle glow effect behind card */}
          <View className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
          
          <Text className="text-2xl font-bold text-white mb-2">Welcome Back</Text>
          <Text className="text-sm text-slate-400 mb-8">Sign in to your workspace to continue.</Text>

          {error ? (
            <View className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl mb-4">
              <Text className="text-rose-400 text-sm font-semibold text-center">{error}</Text>
            </View>
          ) : null}

          <View className="gap-5">
            <View>
              <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Work Email
              </Text>
              <View className="flex-row items-center bg-slate-950/50 rounded-2xl border border-slate-800 px-4 py-2 focus:border-amber-500/50">
                <Ionicons name="mail" size={20} color="#64748b" />
                <TextInput
                  className="flex-1 p-3 text-slate-100 text-base ml-2"
                  placeholder="name@restaurant.com"
                  placeholderTextColor="#475569"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View>
              <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Password
              </Text>
              <View className="flex-row items-center bg-slate-950/50 rounded-2xl border border-slate-800 px-4 py-2 focus:border-amber-500/50">
                <Ionicons name="lock-closed" size={20} color="#64748b" />
                <TextInput
                  className="flex-1 p-3 text-slate-100 text-base ml-2"
                  placeholder="••••••••"
                  placeholderTextColor="#475569"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2">
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#64748b"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className={`bg-amber-500 p-4 rounded-2xl items-center mt-4 shadow-lg shadow-amber-500/30 flex-row justify-center ${
                isLoading ? 'opacity-80' : 'hover:bg-amber-400'
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="#0f172a" />
              ) : (
                <>
                  <Text className="text-slate-950 font-extrabold text-lg mr-2">Sign In</Text>
                  <Ionicons name="arrow-forward" size={20} color="#0f172a" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Demo Hint */}
        <Text className="text-center text-slate-500 text-xs mt-8">
          Demo Accounts: owner@, staff@, driver@, kitchen@
        </Text>
      </View>
    </ScrollView>
  );
}
