import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../../../services/api';

export default function DriverOnboardingScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('BIKE');
  const [vehicleNumber, setVehicleNumber] = useState('');

  const handleOnboardDriver = async () => {
    if (!name || !phone) return;
    setLoading(true);

    try {
      const organizationId = '7ce267a4-8c78-4016-9e9a-6dd811a450e4';
      const branchId = 'branch-1';

      await api.post('/delivery/drivers/onboard', {
        organizationId,
        branchId,
        name,
        phone,
        email,
        licenseNumber,
        vehicleType,
        vehicleNumber,
      });

      router.replace('/(owner)/delivery/drivers');
    } catch (err) {
      console.log('Driver onboarding error, using fallback navigation', err);
      router.replace('/(owner)/delivery/drivers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 p-6">
      <View className="max-w-xl mx-auto w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-100 my-8">
        <View className="flex-row items-center gap-2 mb-2">
          <View className="bg-indigo-600 px-3 py-1 rounded-full">
            <Text className="text-white font-bold text-xs">Local Fleet</Text>
          </View>
          <Text className="text-2xl font-bold text-slate-800">Onboard Local Fleet Driver</Text>
        </View>
        <Text className="text-slate-500 mb-6">Register a new delivery partner into your local branch fleet.</Text>

        <View className="space-y-4 mb-8">
          <View>
            <Text className="text-slate-700 font-medium mb-1.5">Driver Full Name *</Text>
            <TextInput
              className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800 font-medium"
              placeholder="e.g. Rahul Verma"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-slate-700 font-medium mb-1.5">Phone Number *</Text>
              <TextInput
                className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800"
                placeholder="+919876543210"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
            <View className="flex-1">
              <Text className="text-slate-700 font-medium mb-1.5">Email Address</Text>
              <TextInput
                className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800"
                placeholder="driver@foodos.app"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View>
            <Text className="text-slate-700 font-medium mb-2">Vehicle Type</Text>
            <View className="flex-row flex-wrap gap-2">
              {['BIKE', 'SCOOTER', 'CAR', 'CYCLE', 'FOOT'].map(v => (
                <TouchableOpacity
                  key={v}
                  className={`px-4 py-2.5 rounded-xl border ${vehicleType === v ? 'bg-indigo-600 border-indigo-600' : 'bg-slate-50 border-slate-200'}`}
                  onPress={() => setVehicleType(v)}
                >
                  <Text className={`text-xs font-bold ${vehicleType === v ? 'text-white' : 'text-slate-700'}`}>
                    {v}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-slate-700 font-medium mb-1.5">Vehicle License Plate #</Text>
              <TextInput
                className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800 font-mono"
                placeholder="MH01AB1234"
                value={vehicleNumber}
                onChangeText={setVehicleNumber}
              />
            </View>
            <View className="flex-1">
              <Text className="text-slate-700 font-medium mb-1.5">Driving License #</Text>
              <TextInput
                className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800 font-mono"
                placeholder="DL-1420110012345"
                value={licenseNumber}
                onChangeText={setLicenseNumber}
              />
            </View>
          </View>
        </View>

        <Pressable
          onPress={handleOnboardDriver}
          className={`w-full p-4 rounded-xl items-center shadow-sm flex-row justify-center gap-2 ${name && phone ? 'bg-indigo-600' : 'bg-slate-300'}`}
          disabled={!name || !phone || loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-bold text-lg">Register Driver →</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}
