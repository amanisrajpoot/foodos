import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthStore } from '../../../stores/auth.store';
import { api } from '../../../services/api';

export default function CustomerProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { organizationId } = useAuthStore();

  const [customer, setCustomer] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (organizationId && id) {
      fetchCustomerDetails();
    }
  }, [organizationId, id]);

  const fetchCustomerDetails = async () => {
    setLoading(true);
    try {
      const [custRes, walletRes] = await Promise.all([
        api.get(`/customers/${id}?organizationId=${organizationId}`),
        api.get(`/customers/${id}/wallet/balance?organizationId=${organizationId}`)
      ]);
      
      if (custRes.status === 200) {
        setCustomer(custRes.data);
      }
      if (walletRes.status === 200) {
        setWalletBalance(walletRes.data.balanceMinor);
      }
    } catch (e) {
      console.error('Failed to fetch customer profile', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#2563eb" className="mt-20" />;
  }

  if (!customer) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl text-gray-500">Customer not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6">
      <View className="flex-row justify-between items-start mb-6">
        <View>
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Text className="text-blue-600 font-medium">← Back to Customers</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-gray-900">{customer.fullName}</Text>
          <Text className="text-gray-500 mt-1">{customer.phone} • {customer.email}</Text>
        </View>
        <View className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 items-end">
          <Text className="text-sm text-gray-500 mb-1">Wallet Balance</Text>
          <Text className="text-2xl font-bold text-blue-600">${(walletBalance / 100).toFixed(2)}</Text>
        </View>
      </View>

      <View className="flex-row gap-6 mb-8">
        <View className="flex-1 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <Text className="text-gray-500 mb-2">Lifetime Spend</Text>
          <Text className="text-2xl font-bold text-gray-900">${(customer.lifetimeSpendMinor / 100).toFixed(2)}</Text>
        </View>
        <View className="flex-1 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <Text className="text-gray-500 mb-2">Total Orders</Text>
          <Text className="text-2xl font-bold text-gray-900">{customer.orderCount}</Text>
        </View>
        <View className="flex-1 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <Text className="text-gray-500 mb-2">Last Visit</Text>
          <Text className="text-2xl font-bold text-gray-900">
            {customer.lastOrderAt ? new Date(customer.lastOrderAt).toLocaleDateString() : 'Never'}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-4 mb-6">
        <TouchableOpacity
          className="bg-blue-50 px-5 py-3 rounded-xl border border-blue-100"
          onPress={() => router.push(`/(owner)/customers/${id}/addresses`)}
        >
          <Text className="text-blue-700 font-medium">Manage Addresses</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-gray-100 px-5 py-3 rounded-xl border border-gray-200"
          onPress={() => router.push(`/(owner)/customers/${id}/reviews`)}
        >
          <Text className="text-gray-700 font-medium">View Reviews</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-xl font-bold text-gray-900 mb-4">Recent Orders</Text>
      {customer.orders && customer.orders.length > 0 ? (
        customer.orders.map((order: any) => (
          <View key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3 flex-row justify-between items-center">
            <View>
              <Text className="font-bold text-gray-900">Order #{order.orderNumber}</Text>
              <Text className="text-gray-500 text-sm mt-1">{new Date(order.createdAt).toLocaleDateString()}</Text>
            </View>
            <Text className="font-bold text-gray-900">${(order.totalMinor / 100).toFixed(2)}</Text>
          </View>
        ))
      ) : (
        <Text className="text-gray-500">No recent orders</Text>
      )}
    </ScrollView>
  );
}
