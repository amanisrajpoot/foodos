import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';

export default function CreateRestaurantScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [restaurantName, setRestaurantName] = useState('');
  const [brandLogoUrl, setBrandLogoUrl] = useState('');
  const [cuisineTypes, setCuisineTypes] = useState('NORTH_INDIAN, CHINESE');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const handleNext = () => {
    if (!restaurantName) return;
    router.push({
      pathname: '/(onboarding)/create-branch',
      params: {
        ...params,
        restaurantName,
        brandLogoUrl,
        cuisineTypes,
        description,
        primaryContactName: contactName,
        primaryContactPhone: contactPhone,
        primaryContactEmail: contactEmail,
      },
    });
  };

  return (
    <ScrollView className="flex-1 bg-slate-950 px-4 sm:px-8 py-10">
      <View className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="w-14 h-14 bg-indigo-500/10 rounded-2xl items-center justify-center border border-indigo-500/20 mb-3">
            <Ionicons name="restaurant" size={28} color="#6366f1" />
          </View>
          <Text className="text-3xl font-extrabold text-white tracking-tight">
            Restaurant Brand Identity
          </Text>
          <Text className="text-slate-400 text-sm mt-1 text-center">
            Define your culinary brand name, cuisines & primary contact credentials
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="bg-slate-900 p-4 rounded-2xl border border-slate-800 mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xs font-bold text-indigo-400">STEP 2 OF 5</Text>
            <Text className="text-xs text-slate-400 font-medium">40% Completed</Text>
          </View>
          <View className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <View className="w-2/5 h-full bg-indigo-500 rounded-full" />
          </View>
        </View>

        {/* Form Card */}
        <Card title="Brand Profile & Cuisines" glow="indigo">
          <View className="gap-4">
            <View>
              <Text className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Restaurant Brand Name *
              </Text>
              <TextInput
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-100 text-sm"
                placeholder="e.g. Royal Spice Bistro / Burger Kingdom"
                placeholderTextColor="#64748b"
                value={restaurantName}
                onChangeText={setRestaurantName}
              />
            </View>

            <View>
              <Text className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Cuisine Specialties (Comma Separated)
              </Text>
              <TextInput
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-100 text-sm"
                placeholder="NORTH_INDIAN, CHINESE, ITALIAN, FAST_FOOD"
                placeholderTextColor="#64748b"
                value={cuisineTypes}
                onChangeText={setCuisineTypes}
              />
            </View>

            <View>
              <Text className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Brand Description
              </Text>
              <TextInput
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-100 text-sm"
                placeholder="Authentic North Indian curries, tandoori grills, and fresh naan."
                placeholderTextColor="#64748b"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>

            <View className="pt-2 border-t border-slate-800">
              <Text className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Primary Manager Contact Details
              </Text>
              <View className="gap-3">
                <TextInput
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-100 text-sm"
                  placeholder="Manager Name (e.g. Rahul Verma)"
                  placeholderTextColor="#64748b"
                  value={contactName}
                  onChangeText={setContactName}
                />
                <TextInput
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-100 text-sm"
                  placeholder="Manager Phone (+91 98765 43210)"
                  placeholderTextColor="#64748b"
                  value={contactPhone}
                  onChangeText={setContactPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleNext}
              disabled={!restaurantName}
              className={`p-4 rounded-xl items-center mt-4 shadow-lg ${
                restaurantName ? 'bg-indigo-600 shadow-indigo-500/25' : 'bg-slate-800'
              }`}
            >
              <Text
                className={`font-extrabold text-base ${
                  restaurantName ? 'text-white' : 'text-slate-500'
                }`}
              >
                Next: Configure Initial Branch →
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}
