import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

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

  const handleNext = () => {
    if (!branchName || !addressLine1) return;
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
    <ScrollView className="flex-1 bg-slate-50 p-6">
      <View className="max-w-xl mx-auto w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-100 my-8">
        <View className="flex-row items-center gap-2 mb-2">
          <View className="bg-blue-600 px-3 py-1 rounded-full">
            <Text className="text-white font-bold text-xs">Step 3 of 5</Text>
          </View>
          <Text className="text-2xl font-bold text-slate-800">Add First Branch Location</Text>
        </View>
        <Text className="text-slate-500 mb-6">Create your primary physical, cloud kitchen, or hybrid branch.</Text>

        <View className="space-y-4 mb-8">
          <View>
            <Text className="text-slate-700 font-medium mb-1.5">Branch Name *</Text>
            <TextInput
              className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800 font-medium"
              placeholder="e.g. Downtown Main Branch"
              value={branchName}
              onChangeText={setBranchName}
            />
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-slate-700 font-medium mb-1.5">Branch Code</Text>
              <TextInput
                className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800 font-mono"
                placeholder="BR-001"
                value={branchCode}
                onChangeText={setBranchCode}
              />
            </View>
          </View>

          {/* Branch Type Selector */}
          <View>
            <Text className="text-slate-700 font-medium mb-2">Branch Operating Model</Text>
            <View className="flex-row flex-wrap gap-2">
              {['DINE_IN', 'CLOUD_KITCHEN', 'TAKEAWAY', 'HYBRID'].map(type => (
                <TouchableOpacity
                  key={type}
                  className={`px-4 py-2.5 rounded-xl border ${branchType === type ? 'bg-blue-600 border-blue-600' : 'bg-slate-50 border-slate-200'}`}
                  onPress={() => setBranchType(type)}
                >
                  <Text className={`text-xs font-bold ${branchType === type ? 'text-white' : 'text-slate-700'}`}>
                    {type.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-slate-700 font-medium mb-1.5">Branch Phone</Text>
              <TextInput
                className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800"
                placeholder="+91 9876543210"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
            <View className="flex-1">
              <Text className="text-slate-700 font-medium mb-1.5">Branch Email</Text>
              <TextInput
                className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800"
                placeholder="downtown@restaurant.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View>
            <Text className="text-slate-700 font-medium mb-1.5">Street Address *</Text>
            <TextInput
              className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800"
              placeholder="Shop #12, Ground Floor, MG Road"
              value={addressLine1}
              onChangeText={setAddressLine1}
            />
          </View>

          <View className="flex-row gap-3">
            <TextInput
              className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800"
              placeholder="City (e.g. Mumbai)"
              value={city}
              onChangeText={setCity}
            />
            <TextInput
              className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800"
              placeholder="State (e.g. Maharashtra)"
              value={state}
              onChangeText={setState}
            />
            <TextInput
              className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800"
              placeholder="Pincode"
              value={postalCode}
              onChangeText={setPostalCode}
            />
          </View>

          <View className="flex-row gap-4 pt-2">
            <View className="flex-1">
              <Text className="text-slate-700 font-medium mb-1.5">Latitude</Text>
              <TextInput
                className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800 font-mono text-xs"
                placeholder="19.0760"
                value={latitude}
                onChangeText={setLatitude}
              />
            </View>
            <View className="flex-1">
              <Text className="text-slate-700 font-medium mb-1.5">Longitude</Text>
              <TextInput
                className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800 font-mono text-xs"
                placeholder="72.8777"
                value={longitude}
                onChangeText={setLongitude}
              />
            </View>
          </View>
        </View>

        <Pressable
          onPress={handleNext}
          className={`w-full p-4 rounded-xl items-center shadow-sm ${branchName && addressLine1 ? 'bg-blue-600' : 'bg-slate-300'}`}
          disabled={!branchName || !addressLine1}
        >
          <Text className="text-white font-semibold text-lg">Next: Invite Team →</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
