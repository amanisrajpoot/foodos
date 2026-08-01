import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';
import { FormInput } from '../../components/ui/FormInput';
import { validateEmail } from '../../utils/validation';

export default function InviteStaffScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [role, setRole] = useState('MANAGER');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const newErrors: Record<string, string> = {};
    
    if (adminEmail) {
      const emailErr = validateEmail(adminEmail);
      if (emailErr) newErrors.adminEmail = emailErr;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
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
    <ScrollView className="flex-1 bg-slate-950 px-4 sm:px-8 py-10">
      <View className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="w-14 h-14 bg-indigo-500/10 rounded-2xl items-center justify-center border border-indigo-500/20 mb-3">
            <Ionicons name="people" size={28} color="#6366f1" />
          </View>
          <Text className="text-3xl font-extrabold text-white tracking-tight">
            Invite Key Team Members
          </Text>
          <Text className="text-slate-400 text-sm mt-1 text-center">
            Add a store manager or lead staff member to get started
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="bg-slate-900 p-4 rounded-2xl border border-slate-800 mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xs font-bold text-indigo-400">STEP 4 OF 5</Text>
            <Text className="text-xs text-slate-400 font-medium">80% Completed</Text>
          </View>
          <View className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <View className="w-4/5 h-full bg-indigo-500 rounded-full" />
          </View>
        </View>

        {/* Form Card */}
        <Card title="Team Invitation" glow="indigo">
          <View className="gap-2">
            <FormInput
              label="Staff Full Name"
              placeholder="e.g. Ramesh Sharma"
              value={adminName}
              onChangeText={setAdminName}
              glowColor="indigo"
            />

            <FormInput
              label="Email Address"
              placeholder="manager@restaurant.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={adminEmail}
              onChangeText={(t) => { setAdminEmail(t); setErrors((e) => ({ ...e, adminEmail: '' })); }}
              error={errors.adminEmail}
              glowColor="indigo"
            />

            <View className="mb-4">
              <Text className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Assign Primary Role
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {['MANAGER', 'CASHIER', 'KITCHEN_STAFF', 'WAITER'].map((r) => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setRole(r)}
                    className={`px-4 py-2.5 rounded-xl border ${
                      role === r 
                        ? 'bg-indigo-500/20 border-indigo-500' 
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <Text className={`text-xs font-bold ${
                      role === r ? 'text-indigo-400' : 'text-slate-400'
                    }`}>
                      {r.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={handleNext}
              className="p-4 rounded-xl items-center mt-2 shadow-lg bg-indigo-600 shadow-indigo-500/25"
            >
              <Text className="font-extrabold text-base text-white">
                Next: Review & Activate →
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleNext} className="mt-4 py-2">
              <Text className="text-slate-500 text-center font-medium">
                Skip staff invitation for now
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}
