import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { useAuthStore } from '../../stores/auth.store';
import { Ionicons } from '@expo/vector-icons';

export default function StaffLayout() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  const tabs = [
    { name: 'POS Terminal', route: '/(staff)' },
    { name: 'Floorplan', route: '/(staff)/tables' },
    { name: 'Active Orders', route: '/(staff)/orders' },
  ];

  return (
    <View className="flex-1 bg-slate-950">
      {/* Top Navigation Bar */}
      <View className="bg-slate-900 border-b border-slate-800 flex-row items-center justify-between px-6 py-4 z-50 shadow-md">
        <View className="flex-row items-center gap-8">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-amber-500 rounded-xl items-center justify-center mr-3">
              <Ionicons name="card" size={20} color="#0f172a" />
            </View>
            <View>
              <Text className="text-xl font-extrabold text-white">Service</Text>
              <Text className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                POS Terminal
              </Text>
            </View>
          </View>

          {/* Navigation Tabs */}
          <View className="flex-row bg-slate-950 p-1 rounded-xl border border-slate-800">
            {tabs.map((tab) => {
              const isActive = pathname === tab.route;
              return (
                <Pressable
                  key={tab.route}
                  onPress={() => router.push(tab.route as any)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isActive ? 'bg-amber-500' : 'bg-transparent hover:bg-slate-800'
                  }`}
                >
                  <Text
                    className={`text-sm font-bold ${
                      isActive ? 'text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    {tab.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* User Info & Logout */}
        <View className="flex-row items-center gap-4">
          <View className="bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
            <Text className="text-xs font-bold text-slate-300">Register #2 (Main)</Text>
          </View>
          
          <Pressable
            onPress={handleLogout}
            className="flex-row items-center bg-rose-500/10 px-3 py-2 rounded-xl border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
          >
            <Ionicons name="log-out-outline" size={16} color="#fb7185" style={{ marginRight: 6 }} />
            <Text className="text-rose-400 font-bold text-xs">End Shift</Text>
          </Pressable>
        </View>
      </View>

      <View className="flex-1">
        <Slot />
      </View>
    </View>
  );
}
