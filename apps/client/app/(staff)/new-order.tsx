import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';

// Mock data for Sprint 3
const MOCK_MENU = [
  { id: 'item_1', name: 'Margherita Pizza', priceMinor: 1200, hasModifiers: true },
  { id: 'item_2', name: 'Pepperoni Pizza', priceMinor: 1500, hasModifiers: false },
  { id: 'item_3', name: 'Garlic Bread', priceMinor: 500, hasModifiers: false },
  { id: 'item_4', name: 'Cola', priceMinor: 300, hasModifiers: false },
];

export default function NewOrderScreen() {
  const router = useRouter();
  const { items, addItem, removeItem, getSubtotal, channel, setChannel, clearCart } = useCartStore();

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modifierNote, setModifierNote] = useState('');
  
  const { organizationId } = useAuthStore();
  const [phoneSearch, setPhoneSearch] = useState('');
  const [customer, setCustomer] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [customerAddresses, setCustomerAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const searchCustomer = async () => {
    if (!phoneSearch) return;
    try {
      const res = await fetch(`http://localhost:3001/customers?organizationId=${organizationId}&q=${phoneSearch}`);
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          const cust = data[0];
          setCustomer(cust);
          
          // Fetch wallet balance
          const walletRes = await fetch(`http://localhost:3001/customers/${cust.id}/wallet/balance?organizationId=${organizationId}`);
          if (walletRes.ok) {
            const walletData = await walletRes.json();
            setWalletBalance(walletData.balanceMinor);
          }

          // Fetch addresses
          const addrRes = await fetch(`http://localhost:3001/customers/${cust.id}/addresses?organizationId=${organizationId}`);
          if (addrRes.ok) {
            const addrData = await addrRes.json();
            setCustomerAddresses(addrData);
            if (addrData.length > 0) {
              setSelectedAddress(addrData[0].id);
            }
          }
        } else {
          alert('Customer not found');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirm = async () => {
    // In real app, we would pass customer.id and selectedAddress to the order API here
    console.log('Confirming order with customer:', customer?.id, 'address:', selectedAddress);
    clearCart();
    router.replace('/(staff)/orders');
  };

  const handleItemTap = (item: any) => {
    if (item.hasModifiers) {
      setSelectedItem(item);
      setModifierNote('');
      setModalVisible(true);
    } else {
      addItem({
        menuItemId: item.id,
        name: item.name,
        quantity: 1,
        unitPriceMinor: item.priceMinor
      });
    }
  };

  const handleAddWithModifiers = () => {
    if (selectedItem) {
      addItem({
        menuItemId: selectedItem.id,
        name: selectedItem.name,
        quantity: 1,
        unitPriceMinor: selectedItem.priceMinor,
        specialInstructions: modifierNote || undefined,
      });
    }
    setModalVisible(false);
  };

  return (
    <View className="flex-1 bg-gray-50 flex-row">
      {/* Left Side - Menu Grid */}
      <View className="flex-1 p-6">
        <Text className="text-3xl font-bold mb-6 text-gray-900">Take Order</Text>
        <View className="flex-row flex-wrap gap-4">
          {MOCK_MENU.map(item => (
            <TouchableOpacity
              key={item.id}
              className="w-40 h-40 bg-white rounded-3xl p-5 justify-between shadow-sm border border-gray-100"
              onPress={() => handleItemTap(item)}
            >
              <Text className="font-bold text-lg text-gray-800">{item.name}</Text>
              <View>
                {item.hasModifiers && <Text className="text-xs text-gray-400 mb-1">Has Modifiers</Text>}
                <Text className="text-blue-600 font-semibold text-lg">${(item.priceMinor / 100).toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Right Side - Cart */}
      <View className="w-96 bg-white border-l border-gray-200 p-6 flex-col">
        
        {/* Customer Lookup */}
        <View className="mb-6 bg-blue-50 p-4 rounded-2xl border border-blue-100">
          {!customer ? (
            <View>
              <Text className="font-bold text-gray-900 mb-2">Customer Lookup</Text>
              <View className="flex-row gap-2">
                <TextInput
                  className="flex-1 bg-white px-3 py-2 rounded-lg border border-gray-200"
                  placeholder="Phone number"
                  value={phoneSearch}
                  onChangeText={setPhoneSearch}
                  keyboardType="phone-pad"
                />
                <TouchableOpacity onPress={searchCustomer} className="bg-blue-600 px-4 justify-center rounded-lg">
                  <Text className="text-white font-medium">Find</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <View className="flex-row justify-between items-center mb-1">
                <Text className="font-bold text-lg text-gray-900">{customer.fullName}</Text>
                <TouchableOpacity onPress={() => { setCustomer(null); setPhoneSearch(''); }}>
                  <Text className="text-red-500 text-sm">Clear</Text>
                </TouchableOpacity>
              </View>
              <Text className="text-gray-600 text-sm">{customer.phone}</Text>
              <Text className="text-blue-700 font-semibold mt-2">Wallet: ${(walletBalance / 100).toFixed(2)}</Text>
            </View>
          )}
        </View>

        <Text className="text-2xl font-bold mb-4 text-gray-900">Current Order</Text>
        
        <View className="flex-row mb-6 bg-gray-100 p-1 rounded-xl">
          {['DINE_IN', 'TAKEAWAY', 'DELIVERY'].map(ch => (
            <TouchableOpacity
              key={ch}
              onPress={() => setChannel(ch)}
              className={`flex-1 py-2 rounded-lg items-center ${channel === ch ? 'bg-white shadow-sm' : ''}`}
            >
              <Text className={`font-medium ${channel === ch ? 'text-gray-900' : 'text-gray-500'}`}>
                {ch.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {channel === 'DELIVERY' && customer && customerAddresses.length > 0 && (
          <View className="mb-4">
            <Text className="font-bold text-gray-800 mb-2">Delivery Address</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
              {customerAddresses.map(addr => (
                <TouchableOpacity
                  key={addr.id}
                  onPress={() => setSelectedAddress(addr.id)}
                  className={`p-3 rounded-lg border mr-2 ${selectedAddress === addr.id ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'}`}
                >
                  <Text className={`font-medium ${selectedAddress === addr.id ? 'text-blue-900' : 'text-gray-700'}`}>
                    {addr.addressLine1}
                  </Text>
                  <Text className="text-xs text-gray-500">{addr.city}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <ScrollView className="flex-1">
          {items.map(item => (
            <View key={item.id} className="flex-row justify-between items-center mb-4 border-b border-gray-50 pb-4">
              <View className="flex-1">
                <Text className="font-bold text-gray-800 text-lg">{item.name}</Text>
                {item.specialInstructions && <Text className="text-sm text-blue-600 mt-1">{item.specialInstructions}</Text>}
                <Text className="text-gray-500 mt-1">Qty: {item.quantity}</Text>
              </View>
              <View className="items-end ml-4">
                <Text className="font-semibold text-gray-900 text-lg">
                  ${((item.unitPriceMinor * item.quantity) / 100).toFixed(2)}
                </Text>
                <TouchableOpacity onPress={() => removeItem(item.id)} className="mt-2 bg-red-50 px-3 py-1 rounded-lg">
                  <Text className="text-red-600 text-sm font-medium">Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {items.length === 0 && (
            <Text className="text-gray-400 text-center mt-10">Cart is empty</Text>
          )}
        </ScrollView>

        <View className="pt-4 mt-auto border-t border-gray-100">
          <View className="flex-row justify-between mb-6">
            <Text className="text-xl font-bold text-gray-900">Total</Text>
            <Text className="text-xl font-bold text-blue-600">${(getSubtotal() / 100).toFixed(2)}</Text>
          </View>
          
          <TouchableOpacity
            className={`py-4 rounded-2xl items-center ${items.length > 0 ? 'bg-blue-600 shadow-md shadow-blue-200' : 'bg-gray-200'}`}
            disabled={items.length === 0}
            onPress={handleConfirm}
          >
            <Text className={`font-bold text-lg ${items.length > 0 ? 'text-white' : 'text-gray-400'}`}>
              Send to Kitchen
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modifier Picker Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white w-96 rounded-3xl p-6">
            <Text className="text-2xl font-bold mb-4">{selectedItem?.name} Modifiers</Text>
            
            <Text className="font-bold text-gray-700 mb-2">Crust Type</Text>
            <View className="flex-row gap-2 mb-6">
              <TouchableOpacity className="bg-blue-100 px-4 py-2 rounded-xl border border-blue-300">
                <Text className="text-blue-800 font-medium">Thin Crust</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-xl" onPress={() => setModifierNote('Thick Crust')}>
                <Text className="text-gray-800 font-medium">Thick Crust</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-4 mt-4">
              <TouchableOpacity className="flex-1 bg-gray-200 py-3 rounded-xl items-center" onPress={() => setModalVisible(false)}>
                <Text className="font-bold text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-blue-600 py-3 rounded-xl items-center" onPress={handleAddWithModifiers}>
                <Text className="font-bold text-white">Add to Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
