import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function InviteStaffScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [role, setRole] = useState('MANAGER');

  const handleNext = () => {
    router.push({
      pathname: '/(onboarding)/review',
      params: {
        ...params,
        adminName,
        adminEmail,
        role,
      },
    });
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 p-6">
      <View className="max-w-xl mx-auto w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-100 my-8">
        <View className="flex-row items-center gap-2 mb-2">
          <View className="bg-blue-600 px-3 py-1 rounded-full">
            <Text className="text-white font-bold text-xs">Step 4 of 5</Text>
          </View>
          <Text className="text-2xl font-bold text-slate-800">Invite Key Team Members</Text>
        </View>
        <Text className="text-slate-500 mb-6">Add a store manager or lead staff member to get started.</Text>

        <View className="space-y-4 mb-8">
          <View>
            <Text className="text-slate-700 font-medium mb-1.5">Staff Full Name</Text>
            <TextInput
              className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800"
              placeholder="e.g. Ramesh Sharma"
              value={adminName}
              onChangeText={setAdminName}
            />
          </View>

          <View>
            <Text className="text-slate-700 font-medium mb-1.5">Email Address</Text>
            <TextInput
              className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800"
              placeholder="manager@restaurant.com"
              value={adminEmail}
              onChangeText={setAdminEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-slate-700 font-medium mb-2">Assign Primary Role</Text>
            <View className="flex-row flex-wrap gap-2">
              {['MANAGER', 'CASHIER', 'KITCHEN_STAFF', 'WAITER'].map(r => (
                <TouchableOpacity
                  key={r}
                  className={`px-4 py-2.5 rounded-xl border ${role === r ? 'bg-blue-600 border-blue-600' : 'bg-slate-50 border-slate-200'}`}
                  onPress={() => setRole(r)}
                >
                  <Text className={`text-xs font-bold ${role === r ? 'text-white' : 'text-slate-700'}`}>
                    {r.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <Pressable
          onPress={handleNext}
          className="w-full bg-blue-600 p-4 rounded-xl items-center shadow-sm"
        >
          <Text className="text-white font-semibold text-lg">Next: Review & Activate →</Text>
        </Pressable>

        <Pressable onPress={handleNext} className="mt-4">
          <Text className="text-slate-500 text-center font-medium">Skip staff invitation for now</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
