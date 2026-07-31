import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useAuthStore } from '../../stores/auth.store';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';

export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const [email, setEmail] = useState('owner@foodos.app');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'OWNER' | 'MANAGER' | 'STAFF' | 'DRIVER'>('OWNER');

  const handleRoleQuickSelect = (role: 'OWNER' | 'MANAGER' | 'STAFF' | 'DRIVER') => {
    setSelectedRole(role);
    setEmail(`${role.toLowerCase()}@foodos.app`);
  };

  const handleLogin = () => {
    login({ id: `user_${selectedRole.toLowerCase()}`, email }, selectedRole);
    if (selectedRole === 'OWNER') {
      router.replace('/(onboarding)/create-org');
    } else if (selectedRole === 'DRIVER') {
      router.replace('/(delivery)');
    } else if (selectedRole === 'STAFF') {
      router.replace('/(staff)');
    } else {
      router.replace('/(owner)');
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-950 px-4 sm:px-8 py-10">
      <View className="max-w-md mx-auto w-full pt-10">
        {/* Brand Header */}
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-amber-500 rounded-3xl items-center justify-center shadow-xl shadow-amber-500/30 mb-4">
            <Ionicons name="restaurant" size={34} color="#0f172a" />
          </View>
          <Text className="text-4xl font-extrabold text-white tracking-tight">
            Food<Text className="text-amber-400">OS</Text>
          </Text>
          <Text className="text-xs font-bold text-amber-400/90 tracking-widest uppercase mt-1">
            Enterprise Operating System
          </Text>
        </View>

        {/* Role Quick Selector */}
        <View className="bg-slate-900 p-2 rounded-2xl border border-slate-800 mb-6">
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
            Select Portal Role
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {(['OWNER', 'MANAGER', 'STAFF', 'DRIVER'] as const).map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => handleRoleQuickSelect(r)}
                className={`flex-1 py-2 px-3 rounded-xl border items-center min-w-[80px] ${
                  selectedRole === r
                    ? 'bg-amber-500 border-amber-500'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    selectedRole === r ? 'text-slate-950' : 'text-slate-400'
                  }`}
                >
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Login Card */}
        <Card title="Sign In to Enterprise Workspace" glow="amber">
          <View className="gap-4">
            <View>
              <Text className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Work Email
              </Text>
              <View className="flex-row items-center bg-slate-950 rounded-xl border border-slate-800 px-3 py-1">
                <Ionicons name="mail-outline" size={18} color="#64748b" />
                <TextInput
                  className="flex-1 p-3 text-slate-100 text-sm ml-2"
                  placeholder="name@restaurant.com"
                  placeholderTextColor="#64748b"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View>
              <Text className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </Text>
              <View className="flex-row items-center bg-slate-950 rounded-xl border border-slate-800 px-3 py-1">
                <Ionicons name="lock-closed-outline" size={18} color="#64748b" />
                <TextInput
                  className="flex-1 p-3 text-slate-100 text-sm ml-2"
                  placeholder="••••••••"
                  placeholderTextColor="#64748b"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color="#64748b"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              className="bg-amber-500 hover:bg-amber-400 p-4 rounded-xl items-center mt-2 shadow-lg shadow-amber-500/25"
            >
              <Text className="text-slate-950 font-extrabold text-base">
                Sign In as {selectedRole} →
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}
