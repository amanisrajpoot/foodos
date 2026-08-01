import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../services/api';
import { useAuthStore } from '../../stores/auth.store';
import { ErrorState } from '../../components/ui/ErrorState';
import { Ionicons } from '@expo/vector-icons';

export default function NewOrderScreen() {
  const router = useRouter();
  const { organizationId, restaurantId, branchId } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  const [cart, setCart] = useState<{ id: string; name: string; price: number; qty: number; note?: string }[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modifierNote, setModifierNote] = useState('');
  
  const [phoneSearch, setPhoneSearch] = useState('');
  const [customer, setCustomer] = useState<any>(null);
  const [channel, setChannel] = useState<'DINE_IN' | 'TAKEAWAY' | 'DELIVERY'>('TAKEAWAY');
  const [processingOrder, setProcessingOrder] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, [restaurantId]);

  async function fetchMenu() {
    if (!restaurantId) return;
    setLoading(true);
    setError(false);
    try {
      const itemsRes = await api.get(`/menu/restaurants/${restaurantId}/items`);
      setMenuItems(itemsRes.data || []);
    } catch (err) {
      console.error('Failed to fetch menu:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const searchCustomer = async () => {
    if (!phoneSearch) return;
    // In a real app we would search the backend. For now, mock a found customer for V1.
    setCustomer({
      id: 'cust_123',
      fullName: 'Walk-in Customer',
      phone: phoneSearch,
    });
  };

  const handleConfirm = async () => {
    if (cart.length === 0) return;
    setProcessingOrder(true);
    try {
      const payload = {
        organizationId,
        restaurantId,
        branchId,
        channel,
        source: 'POS',
        customerPhone: customer?.phone,
        customerName: customer?.fullName,
        items: cart.map(c => ({
          menuItemId: c.id,
          quantity: c.qty,
          specialInstructions: c.note
        }))
      };
      await api.post('/orders', payload);
      Alert.alert('Success', `Order sent to Kitchen.`);
      setCart([]);
      setCustomer(null);
      setPhoneSearch('');
      router.push('/(staff)/orders');
    } catch (err) {
      console.error('Failed to create order', err);
      Alert.alert('Error', 'Failed to process order. Please try again.');
    } finally {
      setProcessingOrder(false);
    }
  };

  const addToCart = (item: any) => {
    const price = item.basePriceMinor ? item.basePriceMinor / 100 : 0;
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { id: item.id, name: item.name, price, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty - 1 } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const handleItemTap = (item: any) => {
    // If it has modifiers in the future, we can pop the modal here
    addToCart(item);
  };

  const subtotal = cart.reduce((acc, curr) => acc + curr.price * curr.qty, 0);

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-sm font-medium text-slate-400 mt-4">Loading Menu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-950 p-6 sm:p-8">
        <ErrorState onRetry={fetchMenu} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-950 flex-row">
      {/* Left Side - Menu Grid */}
      <View className="flex-1 p-6">
        <Text className="text-3xl font-extrabold mb-8 text-white tracking-tight">Take Order</Text>
        <ScrollView>
          <View className="flex-row flex-wrap gap-4 pb-10">
            {menuItems.map(item => (
              <TouchableOpacity
                key={item.id}
                className="w-44 h-44 bg-slate-900 rounded-[1.5rem] p-5 justify-between shadow-xl border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all"
                onPress={() => handleItemTap(item)}
              >
                <View>
                  <Text className="font-extrabold text-lg text-white mb-1 tracking-tight">{item.name}</Text>
                  <Text className="text-xs text-slate-400 line-clamp-2">{item.description || 'No description'}</Text>
                </View>
                <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-slate-800/80">
                  <Text className="text-amber-400 font-black text-lg">₹{(item.basePriceMinor || 0) / 100}</Text>
                  <Ionicons name="add-circle" size={24} color="#f59e0b" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Right Side - Cart */}
      <View className="w-96 bg-slate-900 border-l border-slate-800 p-6 flex-col shadow-2xl z-10">
        
        {/* Customer Lookup */}
        <View className="mb-6 bg-slate-950/50 p-5 rounded-[1.5rem] border border-slate-800 shadow-inner">
          {!customer ? (
            <View>
              <Text className="font-extrabold text-white mb-3 text-sm uppercase tracking-wider">Customer Lookup</Text>
              <View className="flex-row gap-3">
                <TextInput
                  className="flex-1 bg-slate-900 px-4 py-3 rounded-xl border border-slate-800 text-white font-bold placeholder-slate-500 focus:border-amber-500/50 transition-all"
                  placeholder="Phone number"
                  placeholderTextColor="#64748b"
                  value={phoneSearch}
                  onChangeText={setPhoneSearch}
                  keyboardType="phone-pad"
                />
                <TouchableOpacity onPress={searchCustomer} className="bg-amber-500 hover:bg-amber-400 px-5 justify-center rounded-xl shadow-lg shadow-amber-500/20 transition-all">
                  <Text className="text-slate-950 font-black tracking-wider uppercase text-xs">Find</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <View className="flex-row justify-between items-center mb-1">
                <Text className="font-extrabold text-lg text-white tracking-tight">{customer.fullName}</Text>
                <TouchableOpacity onPress={() => { setCustomer(null); setPhoneSearch(''); }}>
                  <Text className="text-rose-400 font-bold uppercase tracking-wider text-[10px]">Clear</Text>
                </TouchableOpacity>
              </View>
              <Text className="text-slate-400 text-sm font-bold tracking-wider">{customer.phone}</Text>
            </View>
          )}
        </View>

        <Text className="text-2xl font-extrabold mb-5 text-white tracking-tight">Current Order</Text>
        
        <View className="flex-row mb-6 bg-slate-950 rounded-xl p-1 border border-slate-800 shadow-inner">
          {['DINE_IN', 'TAKEAWAY', 'DELIVERY'].map(ch => (
            <TouchableOpacity
              key={ch}
              onPress={() => setChannel(ch as any)}
              className={`flex-1 py-2.5 rounded-lg items-center transition-all ${channel === ch ? 'bg-amber-500/20 border border-amber-500/50 shadow-sm' : ''}`}
            >
              <Text className={`font-extrabold text-[10px] uppercase tracking-widest ${channel === ch ? 'text-amber-400' : 'text-slate-500'}`}>
                {ch.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView className="flex-1 showsVerticalScrollIndicator={false}">
          {cart.map(item => (
            <View key={item.id} className="flex-row justify-between items-center mb-4 border-b border-slate-800/80 pb-4">
              <View className="flex-1 pr-3">
                <Text className="font-bold text-white text-base">{item.name}</Text>
                {item.note && <Text className="text-xs text-amber-400/80 mt-1">{item.note}</Text>}
              </View>
              <View className="items-end">
                <Text className="font-black text-amber-400 text-lg mb-2">
                  ₹{(item.price * item.qty).toFixed(2)}
                </Text>
                <View className="flex-row items-center space-x-3 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 shadow-sm">
                  <TouchableOpacity onPress={() => removeFromCart(item.id)} className="px-2">
                    <Text className="text-sm font-extrabold text-slate-400 hover:text-white">-</Text>
                  </TouchableOpacity>
                  <Text className="text-sm font-extrabold text-white w-4 text-center">{item.qty}</Text>
                  <TouchableOpacity onPress={() => addToCart(item)} className="px-2">
                    <Text className="text-sm font-extrabold text-amber-400 hover:text-amber-300">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
          {cart.length === 0 && (
            <View className="py-12 items-center justify-center opacity-70">
              <Ionicons name="cart-outline" size={32} color="#64748b" className="mb-3" />
              <Text className="text-slate-400 text-sm font-bold tracking-wider">Cart is empty</Text>
            </View>
          )}
        </ScrollView>

        <View className="pt-5 mt-4 border-t border-slate-800">
          <View className="flex-row justify-between mb-6 items-center">
            <Text className="text-sm font-extrabold text-slate-400 uppercase tracking-wider">Total</Text>
            <Text className="text-3xl font-black text-white tracking-tight">₹{subtotal.toFixed(2)}</Text>
          </View>
          
          <TouchableOpacity
            className={`p-5 rounded-[1.5rem] items-center transition-all ${cart.length > 0 ? 'bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/25' : 'bg-slate-800 opacity-50'}`}
            disabled={cart.length === 0 || processingOrder}
            onPress={handleConfirm}
          >
            {processingOrder ? (
              <ActivityIndicator color="#0f172a" />
            ) : (
              <Text className={`font-black text-base uppercase tracking-wider ${cart.length > 0 ? 'text-slate-950' : 'text-slate-500'}`}>
                Send to Kitchen ✓
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
