import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';
import { FormInput } from '../../components/ui/FormInput';
import { validateRequired, validateEmail, validatePhone } from '../../utils/validation';

export default function CreateBranchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [branchName, setBranchName] = useState('');
  const [branchCode, setBranchCode] = useState('BR-001');
  const [branchType, setBranchType] = useState('HYBRID');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [latitude, setLatitude] = useState('19.0760');
  const [longitude, setLongitude] = useState('72.8777');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const newErrors: Record<string, string> = {};
    const nameErr = validateRequired(branchName, 'Branch Name');
    if (nameErr) newErrors.branchName = nameErr;

    const addrErr = validateRequired(addressLine1, 'Street Address');
    if (addrErr) newErrors.addressLine1 = addrErr;

    if (email) {
      const emailErr = validateEmail(email);
      if (emailErr) newErrors.email = emailErr;
    }
    
    if (phone) {
      const phoneErr = validatePhone(phone);
      if (phoneErr) newErrors.phone = phoneErr;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    router.push({
      pathname: '/(onboarding)/invite-staff',
      params: {
        ...params,
        branchName,
        branchCode,
        branchType,
        phone,
        email,
        addressLine1,
        city,
        state,
        postalCode,
        latitude,
        longitude,
      },
    });
  };

  return (
    <ScrollView className="flex-1 bg-slate-950 px-4 sm:px-8 py-10">
      <View className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="w-14 h-14 bg-emerald-500/10 rounded-2xl items-center justify-center border border-emerald-500/20 mb-3">
            <Ionicons name="storefront" size={28} color="#10b981" />
          </View>
          <Text className="text-3xl font-extrabold text-white tracking-tight">
            Add First Branch Location
          </Text>
          <Text className="text-slate-400 text-sm mt-1 text-center">
            Create your primary physical, cloud kitchen, or hybrid branch
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="bg-slate-900 p-4 rounded-2xl border border-slate-800 mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xs font-bold text-emerald-400">STEP 3 OF 5</Text>
            <Text className="text-xs text-slate-400 font-medium">60% Completed</Text>
          </View>
          <View className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <View className="w-3/5 h-full bg-emerald-500 rounded-full" />
          </View>
        </View>

        {/* Form Card */}
        <Card title="Branch Profile & Location" glow="emerald">
          <View className="gap-2">
            <FormInput
              label="Branch Name"
              required
              placeholder="e.g. Downtown Main Branch"
              value={branchName}
              onChangeText={(t) => { setBranchName(t); setErrors((e) => ({ ...e, branchName: '' })); }}
              error={errors.branchName}
              glowColor="emerald"
            />

            <FormInput
              label="Branch Code"
              placeholder="BR-001"
              value={branchCode}
              onChangeText={setBranchCode}
              glowColor="emerald"
            />

            <View className="mb-4">
              <Text className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Branch Operating Model
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {['DINE_IN', 'CLOUD_KITCHEN', 'TAKEAWAY', 'HYBRID'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setBranchType(type)}
                    className={`px-4 py-2.5 rounded-xl border ${
                      branchType === type 
                        ? 'bg-emerald-500/20 border-emerald-500' 
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <Text className={`text-xs font-bold ${
                      branchType === type ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                      {type.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1">
                <FormInput
                  label="Branch Phone"
                  placeholder="+91 9876543210"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={(t) => { setPhone(t); setErrors((e) => ({ ...e, phone: '' })); }}
                  error={errors.phone}
                  glowColor="emerald"
                />
              </View>
              <View className="flex-1">
                <FormInput
                  label="Branch Email"
                  placeholder="downtown@restaurant.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: '' })); }}
                  error={errors.email}
                  glowColor="emerald"
                />
              </View>
            </View>

            <View className="pt-2 border-t border-slate-800 mt-2">
              <Text className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Geographic Address
              </Text>
              
              <FormInput
                label="Street Address"
                required
                placeholder="Shop #12, Ground Floor, MG Road"
                value={addressLine1}
                onChangeText={(t) => { setAddressLine1(t); setErrors((e) => ({ ...e, addressLine1: '' })); }}
                error={errors.addressLine1}
                glowColor="emerald"
              />

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <FormInput label="City" placeholder="Mumbai" value={city} onChangeText={setCity} glowColor="emerald" />
                </View>
                <View className="flex-1">
                  <FormInput label="State" placeholder="Maharashtra" value={state} onChangeText={setState} glowColor="emerald" />
                </View>
                <View className="flex-1">
                  <FormInput label="Pincode" placeholder="400001" value={postalCode} onChangeText={setPostalCode} glowColor="emerald" />
                </View>
              </View>

              <View className="flex-row gap-4">
                <View className="flex-1">
                  <FormInput label="Latitude" placeholder="19.0760" value={latitude} onChangeText={setLatitude} glowColor="emerald" />
                </View>
                <View className="flex-1">
                  <FormInput label="Longitude" placeholder="72.8777" value={longitude} onChangeText={setLongitude} glowColor="emerald" />
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleNext}
              className={`p-4 rounded-xl items-center mt-2 shadow-lg ${
                branchName && addressLine1 ? 'bg-emerald-600 shadow-emerald-500/25' : 'bg-slate-800'
              }`}
            >
              <Text
                className={`font-extrabold text-base ${
                  branchName && addressLine1 ? 'text-white' : 'text-slate-500'
                }`}
              >
                Next: Invite Team →
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}
