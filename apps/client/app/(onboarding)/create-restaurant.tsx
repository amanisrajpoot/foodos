import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';
import { FormInput } from '../../components/ui/FormInput';
import { validateRequired, validateEmail, validatePhone } from '../../utils/validation';

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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    // Validate
    const newErrors: Record<string, string> = {};
    const nameErr = validateRequired(restaurantName, 'Restaurant Brand Name');
    if (nameErr) newErrors.restaurantName = nameErr;

    if (contactEmail) {
      const emailErr = validateEmail(contactEmail);
      if (emailErr) newErrors.contactEmail = emailErr;
    }
    
    if (contactPhone) {
      const phoneErr = validatePhone(contactPhone);
      if (phoneErr) newErrors.contactPhone = phoneErr;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
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
          <View className="gap-2">
            <FormInput
              label="Restaurant Brand Name"
              required
              placeholder="e.g. Royal Spice Bistro / Burger Kingdom"
              value={restaurantName}
              onChangeText={(t) => { setRestaurantName(t); setErrors((e) => ({ ...e, restaurantName: '' })); }}
              error={errors.restaurantName}
              glowColor="indigo"
            />

            <FormInput
              label="Cuisine Specialties (Comma Separated)"
              placeholder="NORTH_INDIAN, CHINESE, ITALIAN"
              value={cuisineTypes}
              onChangeText={setCuisineTypes}
              glowColor="indigo"
            />

            <FormInput
              label="Brand Description"
              placeholder="Authentic North Indian curries..."
              value={description}
              onChangeText={setDescription}
              multiline
              glowColor="indigo"
            />

            <View className="pt-2 border-t border-slate-800 mt-2">
              <Text className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Primary Manager Contact Details
              </Text>
              
              <FormInput
                label="Manager Name"
                placeholder="e.g. Rahul Verma"
                value={contactName}
                onChangeText={setContactName}
                glowColor="indigo"
              />
              
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <FormInput
                    label="Manager Phone"
                    placeholder="+91 98765 43210"
                    keyboardType="phone-pad"
                    value={contactPhone}
                    onChangeText={(t) => { setContactPhone(t); setErrors((e) => ({ ...e, contactPhone: '' })); }}
                    error={errors.contactPhone}
                    glowColor="indigo"
                  />
                </View>
                <View className="flex-1">
                  <FormInput
                    label="Manager Email"
                    placeholder="manager@restaurant.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={contactEmail}
                    onChangeText={(t) => { setContactEmail(t); setErrors((e) => ({ ...e, contactEmail: '' })); }}
                    error={errors.contactEmail}
                    glowColor="indigo"
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleNext}
              className={`p-4 rounded-xl items-center mt-2 shadow-lg ${
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
