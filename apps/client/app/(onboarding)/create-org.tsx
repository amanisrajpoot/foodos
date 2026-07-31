import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useAuthStore } from '../../stores/auth.store';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';

export default function CreateOrgScreen() {
  const setOrganization = useAuthStore((state) => state.setOrganization);
  const router = useRouter();

  const [legalName, setLegalName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [countryCode, setCountryCode] = useState('IN');
  const [currency, setCurrency] = useState('INR');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [taxId, setTaxId] = useState('');

  const handleNext = () => {
    if (!legalName) return;
    setOrganization('org_demo_101');
    router.push('/(owner)');
  };

  return (
    <ScrollView className="flex-1 bg-slate-950 px-4 sm:px-8 py-10">
      <View className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="w-14 h-14 bg-blue-500/10 rounded-2xl items-center justify-center border border-blue-500/20 mb-3">
            <Ionicons name="business" size={28} color="#3b82f6" />
          </View>
          <Text className="text-3xl font-extrabold text-white tracking-tight">
            Restaurant Group Setup
          </Text>
          <Text className="text-slate-400 text-sm mt-1 text-center">
            Register your parent legal entity, billing details & tax defaults
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="bg-slate-900 p-4 rounded-2xl border border-slate-800 mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xs font-bold text-amber-400">STEP 1 OF 3</Text>
            <Text className="text-xs text-slate-400 font-medium">33% Completed</Text>
          </View>
          <View className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <View className="w-1/3 h-full bg-amber-500 rounded-full" />
          </View>
        </View>

        {/* Form Card */}
        <Card title="Legal Entity & Corporate Details">
          <View className="gap-4">
            <View>
              <Text className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Legal Entity Name *
              </Text>
              <TextInput
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-100 text-sm"
                placeholder="e.g. Royal Foods Private Limited"
                placeholderTextColor="#64748b"
                value={legalName}
                onChangeText={setLegalName}
              />
            </View>

            <View>
              <Text className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Trade / Brand Name
              </Text>
              <TextInput
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-100 text-sm"
                placeholder="e.g. Royal Foods & Hospitality"
                placeholderTextColor="#64748b"
                value={tradeName}
                onChangeText={setTradeName}
              />
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Country Code
                </Text>
                <TextInput
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-100 text-sm"
                  placeholder="IN"
                  placeholderTextColor="#64748b"
                  value={countryCode}
                  onChangeText={setCountryCode}
                />
              </View>

              <View className="flex-1">
                <Text className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Default Currency
                </Text>
                <TextInput
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-100 text-sm"
                  placeholder="INR"
                  placeholderTextColor="#64748b"
                  value={currency}
                  onChangeText={setCurrency}
                />
              </View>
            </View>

            <View>
              <Text className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Tax Identification (GSTIN / VAT ID)
              </Text>
              <TextInput
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-100 text-sm"
                placeholder="e.g. 27AAAAA0000A1Z5"
                placeholderTextColor="#64748b"
                value={taxId}
                onChangeText={setTaxId}
              />
            </View>

            <TouchableOpacity
              onPress={handleNext}
              disabled={!legalName}
              className={`p-4 rounded-xl items-center mt-4 shadow-lg ${
                legalName ? 'bg-amber-500 shadow-amber-500/25' : 'bg-slate-800'
              }`}
            >
              <Text
                className={`font-extrabold text-base ${
                  legalName ? 'text-slate-950' : 'text-slate-500'
                }`}
              >
                Complete Onboarding & Launch Dashboard →
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}
