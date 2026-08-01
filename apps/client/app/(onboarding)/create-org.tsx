import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';
import { FormInput } from '../../components/ui/FormInput';
import { validateRequired } from '../../utils/validation';

export default function CreateOrgScreen() {
  const router = useRouter();

  const [legalName, setLegalName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [countryCode, setCountryCode] = useState('IN');
  const [currency, setCurrency] = useState('INR');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [taxId, setTaxId] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    // Validate
    const newErrors: Record<string, string> = {};
    const legalNameErr = validateRequired(legalName, 'Legal Entity Name');
    if (legalNameErr) newErrors.legalName = legalNameErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    router.push({
      pathname: '/(onboarding)/create-restaurant',
      params: {
        legalName,
        tradeName,
        countryCode,
        currency,
        timezone,
        taxId
      }
    });
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
            <Text className="text-xs font-bold text-blue-400">STEP 1 OF 5</Text>
            <Text className="text-xs text-slate-400 font-medium">20% Completed</Text>
          </View>
          <View className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <View className="w-1/5 h-full bg-blue-500 rounded-full" />
          </View>
        </View>

        {/* Form Card */}
        <Card title="Legal Entity & Corporate Details">
          <View className="gap-2">
            <FormInput
              label="Legal Entity Name"
              required
              placeholder="e.g. Royal Foods Private Limited"
              value={legalName}
              onChangeText={(t) => { setLegalName(t); setErrors((e) => ({ ...e, legalName: '' })); }}
              error={errors.legalName}
              glowColor="blue"
            />

            <FormInput
              label="Trade / Brand Name"
              placeholder="e.g. Royal Foods & Hospitality"
              value={tradeName}
              onChangeText={setTradeName}
              glowColor="blue"
            />

            <View className="flex-row gap-4">
              <View className="flex-1">
                <FormInput
                  label="Country Code"
                  placeholder="IN"
                  value={countryCode}
                  onChangeText={setCountryCode}
                  glowColor="blue"
                />
              </View>
              <View className="flex-1">
                <FormInput
                  label="Default Currency"
                  placeholder="INR"
                  value={currency}
                  onChangeText={setCurrency}
                  glowColor="blue"
                />
              </View>
            </View>

            <FormInput
              label="Tax Identification (GSTIN / VAT ID)"
              placeholder="e.g. 27AAAAA0000A1Z5"
              value={taxId}
              onChangeText={setTaxId}
              glowColor="blue"
            />

            <TouchableOpacity
              onPress={handleNext}
              className={`p-4 rounded-xl items-center mt-2 shadow-lg ${
                legalName ? 'bg-blue-600 shadow-blue-500/25' : 'bg-slate-800'
              }`}
            >
              <Text
                className={`font-extrabold text-base ${
                  legalName ? 'text-white' : 'text-slate-500'
                }`}
              >
                Next: Restaurant Brand Identity →
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}
