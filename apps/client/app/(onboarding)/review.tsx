import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../../stores/auth.store';
import { api } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';

export default function OnboardingReviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<any>();
  const setOrganization = useAuthStore(state => state.setOrganization);

  const [loading, setLoading] = useState(false);

  const handleFinishOnboarding = async () => {
    setLoading(true);

    try {
      // 1. Submit Full Onboarding Payload
      const onboardRes = await api.post('/v1/restaurants/onboard', {
        legalName: params.legalName || 'FoodOS Restaurant',
        tradeName: params.tradeName,
        countryCode: params.countryCode || 'IN',
        defaultCurrency: params.currency || 'INR',
        defaultTimezone: params.timezone || 'Asia/Kolkata',
        taxId: params.taxId,

        restaurantName: params.restaurantName || 'Main Brand',
        brandLogoUrl: params.brandLogoUrl,
        cuisineTypes: params.cuisineTypes ? params.cuisineTypes.split(',').map((s: string) => s.trim()) : ['MULTI_CUISINE'],
        description: params.description,
        primaryContactName: params.primaryContactName,
        primaryContactPhone: params.primaryContactPhone,
        primaryContactEmail: params.primaryContactEmail,

        branchName: params.branchName || 'Downtown Branch',
        branchCode: params.branchCode || 'BR-001',
        branchType: params.branchType || 'HYBRID',
        phone: params.phone || params.primaryContactPhone,
        email: params.email || params.primaryContactEmail,
        addressLine1: params.addressLine1 || '123 Main Street',
        city: params.city || 'Mumbai',
        state: params.state || 'Maharashtra',
        postalCode: params.postalCode || '400001',
        latitude: parseFloat(params.latitude) || 19.0760,
        longitude: parseFloat(params.longitude) || 72.8777,

        adminName: params.adminName,
        adminEmail: params.adminEmail,
      });

      const { organization, branch } = onboardRes.data || {};

      // 2. Activate Branch (if needed)
      if (branch?.id) {
        await api.post(`/v1/restaurants/branches/${branch.id}/activate`);
      }

      // 3. Update Auth Context & Navigate
      if (organization?.id) {
        setOrganization(organization.id);
        router.replace('/(owner)');
      }
    } catch (err: any) {
      // The error is now caught by our global interceptor which fires a toast!
      // We don't fall back to mock data anymore.
      console.log('Onboarding failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-950 px-4 sm:px-8 py-10">
      <View className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="w-14 h-14 bg-rose-500/10 rounded-2xl items-center justify-center border border-rose-500/20 mb-3">
            <Ionicons name="rocket" size={28} color="#f43f5e" />
          </View>
          <Text className="text-3xl font-extrabold text-white tracking-tight">
            Review & Launch
          </Text>
          <Text className="text-slate-400 text-sm mt-1 text-center">
            Review your setup configuration before launching your store
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="bg-slate-900 p-4 rounded-2xl border border-slate-800 mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xs font-bold text-rose-400">STEP 5 OF 5</Text>
            <Text className="text-xs text-slate-400 font-medium">100% Ready</Text>
          </View>
          <View className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <View className="w-full h-full bg-rose-500 rounded-full" />
          </View>
        </View>

        {/* Form Card */}
        <Card title="Final Configuration Summary" glow="amber">
          <View className="space-y-4">
            <View className="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-4">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Organization</Text>
              <Text className="text-lg font-bold text-slate-100">{params.legalName || 'Tasty Foods Pvt Ltd'}</Text>
              <Text className="text-xs text-slate-500">{params.countryCode || 'IN'} • {params.currency || 'INR'} • {params.timezone || 'Asia/Kolkata'}</Text>
            </View>

            <View className="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-4">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Brand Concept</Text>
              <Text className="text-lg font-bold text-slate-100">{params.restaurantName || 'Burger Palace'}</Text>
              <Text className="text-xs text-slate-500">Cuisines: {params.cuisineTypes || 'FAST_FOOD'}</Text>
            </View>

            <View className="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-4">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">First Branch Location</Text>
              <Text className="text-lg font-bold text-slate-100">{params.branchName || 'Downtown Branch'} ({params.branchType || 'HYBRID'})</Text>
              <Text className="text-xs text-slate-500">{params.addressLine1 || 'Main Street'}, {params.city || 'Mumbai'}</Text>
            </View>

            {params.adminEmail ? (
              <View className="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-4">
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Key Team Member</Text>
                <Text className="text-base font-bold text-slate-100">{params.adminName || 'Staff Member'}</Text>
                <Text className="text-xs text-slate-500">{params.adminEmail} ({params.role || 'MANAGER'})</Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={handleFinishOnboarding}
              disabled={loading}
              className="p-4 rounded-xl items-center mt-4 shadow-lg bg-rose-600 shadow-rose-500/25 flex-row justify-center gap-2"
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="font-extrabold text-lg text-white">
                  🚀 Confirm & Launch Restaurant
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}
