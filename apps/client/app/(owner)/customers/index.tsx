import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../stores/auth.store';
import { Customer } from '@foodos/shared';

export default function CustomersScreen() {
  const router = useRouter();
  const { organizationId } = useAuthStore();
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (organizationId) {
      fetchCustomers();
    }
  }, [organizationId, searchQuery]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // In a real app this would use the configured API endpoint
      const res = await fetch(
        `http://localhost:3001/customers?organizationId=${organizationId}${searchQuery ? `&q=${searchQuery}` : ''}`
      );
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (e) {
      console.error('Failed to fetch customers', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-bold text-gray-900">Customers</Text>
        <TouchableOpacity
          className="bg-blue-600 px-6 py-3 rounded-xl"
          onPress={() => alert('New Customer modal')}
        >
          <Text className="text-white font-bold">Add Customer</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex-row items-center">
        <Text className="text-gray-400 mr-2">🔍</Text>
        <TextInput
          className="flex-1 text-base text-gray-800"
          placeholder="Search by name, phone, or email..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" className="mt-10" />
      ) : (
        <FlatList
          data={customers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-3 flex-row justify-between items-center"
              onPress={() => router.push(`/(owner)/customers/${item.id}`)}
            >
              <View>
                <Text className="font-bold text-lg text-gray-900">{item.fullName}</Text>
                <Text className="text-gray-500 mt-1">{item.phone || item.email || 'No contact info'}</Text>
              </View>
              <View className="items-end">
                <Text className="text-sm text-gray-500 mb-1">{item.orderCount} Orders</Text>
                <Text className="font-semibold text-green-600">
                  ${(item.lifetimeSpendMinor / 100).toFixed(2)} LTV
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="items-center mt-20">
              <Text className="text-gray-400 text-lg">No customers found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
