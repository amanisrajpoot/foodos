import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { api } from '../../services/api';
import { useAuthStore } from '../../stores/auth.store';
import { ErrorState } from '../../components/ui/ErrorState';

export default function StaffPOSHomeScreen() {
  const router = useRouter();
  const { organizationId, restaurantId, branchId } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tables, setTables] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['ALL']);
  
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [cart, setCart] = useState<{ id: string; name: string; price: number; qty: number }[]>([]);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CARD'>('UPI');
  const [processingOrder, setProcessingOrder] = useState(false);

  useEffect(() => {
    fetchPOSData();
  }, [branchId, restaurantId]);

  async function fetchPOSData() {
    if (!branchId || !restaurantId) return;
    setLoading(true);
    setError(false);
    try {
      const [tablesRes, itemsRes] = await Promise.all([
        api.get(`/restaurants/branches/${branchId}/tables`),
        api.get(`/menu/restaurants/${restaurantId}/items`)
      ]);
      setTables(tablesRes.data || []);
      
      const items = itemsRes.data || [];
      setMenuItems(items);
      
      const cats = Array.from(new Set(items.map((i: any) => i.category?.name || 'Uncategorized')));
      setCategories(['ALL', ...(cats as string[])]);
      
      if (tablesRes.data?.length > 0) {
        setSelectedTable(tablesRes.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch POS data:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

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

  const submitOrder = async () => {
    if (!selectedTable || cart.length === 0) return;
    setProcessingOrder(true);
    try {
      const payload = {
        organizationId,
        restaurantId,
        branchId,
        channel: 'DINE_IN',
        source: 'POS',
        tableId: selectedTable.id,
        items: cart.map(c => ({
          menuItemId: c.id,
          quantity: c.qty
        }))
      };
      await api.post('/orders', payload);
      Alert.alert('Success', `Payment of ₹${grandTotal.toFixed(2)} captured via ${paymentMethod}! Order sent to Kitchen.`);
      setCart([]);
      setShowCheckoutModal(false);
      fetchPOSData(); // refresh tables
    } catch (err) {
      console.error('Failed to create order', err);
      Alert.alert('Error', 'Failed to process order. Please try again.');
    } finally {
      setProcessingOrder(false);
    }
  };

  const subtotal = cart.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
  const tax = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + tax;

  const filteredMenu = menuItems.filter(
    (m) => selectedCategory === 'ALL' || (m.category?.name || 'Uncategorized') === selectedCategory
  );

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-sm font-medium text-slate-400 mt-4">Loading Terminal...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-950 p-6 sm:p-8">
        <ErrorState onRetry={fetchPOSData} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-950 flex-row">
      {/* Left Area: Tables & Menu Grid */}
      <View className="flex-1 p-4 sm:p-6">
        {/* Floorplan Table Grid */}
        <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Dine-In Table Floorplan
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 h-28 max-h-28 min-h-28">
          <View className="flex-row space-x-3">
            {tables.map((tbl) => (
              <TouchableOpacity
                key={tbl.id}
                onPress={() => setSelectedTable(tbl)}
                className={`p-3.5 rounded-xl border w-36 shadow-sm transition-all ${
                  selectedTable?.id === tbl.id
                    ? 'bg-amber-500/20 border-amber-500 shadow-amber-500/20'
                    : tbl.status === 'OCCUPIED'
                    ? 'bg-indigo-950/60 border-indigo-500/30'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-lg font-extrabold text-white">{tbl.label}</Text>
                  <Badge label={tbl.status || 'AVAILABLE'} variant={tbl.status === 'OCCUPIED' ? 'OCCUPIED' : 'AVAILABLE'} size="sm" />
                </View>
                <Text className="text-xs text-slate-400 font-medium">{tbl.section} • {tbl.capacity} Seats</Text>
              </TouchableOpacity>
            ))}
            {tables.length === 0 && (
              <View className="p-3.5 rounded-xl border bg-slate-900 border-slate-800 w-48 justify-center">
                <Text className="text-slate-400 text-sm italic">No tables configured.</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Menu Category Filter Bar */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Menu Item Catalog
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-w-[70%]">
            <View className="flex-row space-x-2">
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg border transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-500 border-amber-500 shadow-lg shadow-amber-500/20'
                      : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Text
                    className={`text-xs font-extrabold tracking-wide uppercase ${
                      selectedCategory === cat ? 'text-slate-950' : 'text-slate-300'
                    }`}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Menu Items Grid */}
        <ScrollView className="flex-1">
          <View className="flex-row flex-wrap gap-4">
            {filteredMenu.length === 0 ? (
              <View className="flex-1 py-12 items-center justify-center bg-slate-900/50 rounded-[1.5rem] border border-slate-800 border-dashed">
                <Text className="text-slate-400 text-sm">No items in this category.</Text>
              </View>
            ) : (
              filteredMenu.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => addToCart(item)}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 p-5 rounded-2xl flex-1 min-w-[220px] max-w-[300px] justify-between shadow-lg transition-all"
                >
                  <View>
                    <Text className="text-lg font-bold text-white mb-1 tracking-tight">{item.name}</Text>
                    <Text className="text-xs text-slate-400 line-clamp-2">{item.description || 'No description available'}</Text>
                  </View>
                  <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-slate-800/80">
                    <Text className="text-base font-extrabold text-amber-400">₹{(item.basePriceMinor || 0) / 100}</Text>
                    <View className="bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/30">
                      <Text className="text-xs font-extrabold tracking-wider uppercase text-amber-400">+ Add</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      </View>

      {/* Right Drawer: Live Cart & Bill Builder */}
      <View className="w-96 bg-slate-900 border-l border-slate-800 p-5 justify-between shadow-2xl z-10">
        <View className="flex-1">
          {/* Cart Header */}
          <View className="flex-row justify-between items-center pb-5 border-b border-slate-800 mb-5">
            <View>
              <Text className="text-xl font-extrabold text-white tracking-tight">Order Cart</Text>
              <Text className="text-xs font-medium text-slate-400 mt-0.5">Table: <Text className="text-amber-400">{selectedTable?.label || 'None'}</Text></Text>
            </View>
            {cart.length > 0 && (
              <TouchableOpacity onPress={() => setCart([])} className="bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
                <Text className="text-xs font-extrabold tracking-wider uppercase text-rose-400">Clear</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Cart Items */}
          <ScrollView className="flex-1 showsVerticalScrollIndicator={false}">
            {cart.length === 0 ? (
              <View className="py-20 items-center justify-center opacity-70">
                <View className="w-16 h-16 bg-slate-800 rounded-full items-center justify-center mb-4">
                  <Ionicons name="cart-outline" size={28} color="#64748b" />
                </View>
                <Text className="text-slate-300 text-sm font-bold tracking-tight">Cart is empty</Text>
                <Text className="text-slate-500 text-xs mt-1 text-center px-4">Tap menu items on the left to add them to the order</Text>
              </View>
            ) : (
              cart.map((item) => (
                <View
                  key={item.id}
                  className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 mb-3 flex-row justify-between items-center shadow-inner"
                >
                  <View className="flex-1 pr-3">
                    <Text className="text-sm font-bold text-slate-100">{item.name}</Text>
                    <Text className="text-xs text-amber-400 font-extrabold mt-0.5">₹{item.price * item.qty}</Text>
                  </View>

                  <View className="flex-row items-center space-x-3 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 shadow-sm">
                    <TouchableOpacity onPress={() => removeFromCart(item.id)} className="px-2">
                      <Text className="text-sm font-extrabold text-slate-400 hover:text-white">-</Text>
                    </TouchableOpacity>
                    <Text className="text-sm font-extrabold text-white w-4 text-center">{item.qty}</Text>
                    <TouchableOpacity onPress={() => addToCart(item)} className="px-2">
                      <Text className="text-sm font-extrabold text-amber-400 hover:text-amber-300">+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>

        {/* Cart Summary & Checkout */}
        {cart.length > 0 && (
          <View className="pt-5 border-t border-slate-800 mt-2">
            <View className="space-y-2 mb-5">
              <View className="flex-row justify-between items-center">
                <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Subtotal</Text>
                <Text className="text-sm font-bold text-slate-200">₹{subtotal.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider">GST Tax (5%)</Text>
                <Text className="text-sm font-bold text-slate-200">₹{tax.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between items-center pt-3 border-t border-slate-800/80 mt-1">
                <Text className="text-base font-extrabold text-white uppercase tracking-wider">Grand Total</Text>
                <Text className="text-2xl font-black text-amber-400 tracking-tight">₹{grandTotal.toFixed(2)}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setShowCheckoutModal(true)}
              className="bg-amber-500 hover:bg-amber-400 p-4 rounded-xl items-center shadow-lg shadow-amber-500/25 transition-all"
            >
              <Text className="text-slate-950 font-black text-base uppercase tracking-wider">Proceed to Checkout →</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Checkout Modal */}
      <Modal
        visible={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        title="Checkout & Payment"
        subtitle={`Table ${selectedTable?.label || 'N/A'} • Total ₹${grandTotal.toFixed(2)}`}
      >
        <View className="space-y-6">
          <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">
            Select Payment Method
          </Text>

          <View className="flex-row gap-4 mb-4">
            {(['UPI', 'CARD', 'CASH'] as const).map((method) => (
              <TouchableOpacity
                key={method}
                onPress={() => setPaymentMethod(method)}
                className={`flex-1 p-4 rounded-2xl border items-center transition-all ${
                  paymentMethod === method
                    ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Ionicons
                  name={
                    method === 'UPI'
                      ? 'qr-code-outline'
                      : method === 'CARD'
                      ? 'card-outline'
                      : 'cash-outline'
                  }
                  size={28}
                  color={paymentMethod === method ? '#f59e0b' : '#64748b'}
                />
                <Text
                  className={`text-xs font-extrabold mt-2 tracking-wider ${
                    paymentMethod === method ? 'text-amber-400' : 'text-slate-400'
                  }`}
                >
                  {method}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={submitOrder}
            disabled={processingOrder}
            className={`bg-emerald-500 hover:bg-emerald-400 p-4 rounded-xl items-center shadow-lg shadow-emerald-500/25 transition-all ${processingOrder ? 'opacity-70' : ''}`}
          >
            {processingOrder ? (
              <ActivityIndicator color="#0f172a" />
            ) : (
              <Text className="text-slate-950 font-black text-base tracking-wider">Confirm Payment & Dispatch ✓</Text>
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
