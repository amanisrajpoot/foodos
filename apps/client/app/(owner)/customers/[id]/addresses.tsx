import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthStore } from '../../../../../stores/auth.store';

export default function CustomerAddressesScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { organizationId } = useAuthStore();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, [id]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/customers/${id}/addresses?organizationId=${organizationId}`);
      if (res.ok) {
        setAddresses(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const removeAddress = async (addressId: string) => {
    try {
      await fetch(`http://localhost:3001/customers/${id}/addresses/${addressId}?organizationId=${organizationId}`, {
        method: 'DELETE'
      });
      fetchAddresses();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6">
      <TouchableOpacity onPress={() => router.back()} className="mb-4">
        <Text className="text-blue-600 font-medium">← Back to Profile</Text>
      </TouchableOpacity>
      
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-bold text-gray-900">Saved Addresses</Text>
        <TouchableOpacity className="bg-blue-600 px-5 py-2 rounded-lg">
          <Text className="text-white font-medium">Add New</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : addresses.length === 0 ? (
        <Text className="text-gray-500">No saved addresses.</Text>
      ) : (
        addresses.map(addr => (
          <View key={addr.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-3 flex-row justify-between items-center">
            <View>
              {addr.label && <Text className="font-bold text-gray-900 mb-1">{addr.label}</Text>}
              <Text className="text-gray-700">{addr.addressLine1}</Text>
              {addr.addressLine2 && <Text className="text-gray-700">{addr.addressLine2}</Text>}
              <Text className="text-gray-500">{addr.city}, {addr.postalCode}</Text>
            </View>
            <TouchableOpacity onPress={() => removeAddress(addr.id)} className="bg-red-50 px-4 py-2 rounded-lg">
              <Text className="text-red-600 font-medium">Remove</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}
