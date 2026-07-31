import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

const MOCK_TABLES = [
  { id: 't1', label: 'T-01', capacity: 4, status: 'AVAILABLE', section: 'Main Hall' },
  { id: 't2', label: 'T-02', capacity: 2, status: 'OCCUPIED', section: 'Main Hall', order: 'ORD-8821', total: '₹1,240' },
  { id: 't3', label: 'T-03', capacity: 6, status: 'OCCUPIED', section: 'VIP Patio', order: 'ORD-8825', total: '₹3,450' },
  { id: 't4', label: 'T-04', capacity: 4, status: 'AVAILABLE', section: 'Main Hall' },
  { id: 't5', label: 'T-05', capacity: 2, status: 'RESERVED', section: 'Window Side' },
  { id: 't6', label: 'T-06', capacity: 8, status: 'AVAILABLE', section: 'VIP Patio' },
];

const MOCK_MENU = [
  { id: 'm1', name: 'Paneer Butter Masala', category: 'MAINS', price: 340, desc: 'Rich tomato cashew gravy' },
  { id: 'm2', name: 'Butter Chicken Large', category: 'MAINS', price: 420, desc: 'Tandoori chicken in velvet gravy' },
  { id: 'm3', name: 'Garlic Naan', category: 'BREADS', price: 65, desc: 'Freshly baked tandoor naan' },
  { id: 'm4', name: 'Dal Makhani', category: 'MAINS', price: 290, desc: 'Slow cooked black lentils' },
  { id: 'm5', name: 'Crispy Veg Spring Rolls', category: 'STARTERS', price: 240, desc: 'Served with sweet chili dip' },
  { id: 'm6', name: 'Mango Lassi', category: 'BEVERAGES', price: 120, desc: 'Thick yogurt beverage' },
];

export default function StaffPOSHomeScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [cart, setCart] = useState<{ id: string; name: string; price: number; qty: number }[]>([]);
  const [selectedTable, setSelectedTable] = useState('T-01');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CARD'>('UPI');

  const addToCart = (item: any) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty - 1 } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const subtotal = cart.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
  const tax = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + tax;

  const filteredMenu = MOCK_MENU.filter(
    (m) => selectedCategory === 'ALL' || m.category === selectedCategory
  );

  return (
    <View className="flex-1 bg-slate-950 flex-row">
      {/* Left Area: Tables & Menu Grid */}
      <View className="flex-1 p-4 sm:p-6">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center space-x-3">
            <View className="w-10 h-10 bg-amber-500/10 rounded-xl items-center justify-center border border-amber-500/20">
              <Ionicons name="card" size={22} color="#f59e0b" />
            </View>
            <View>
              <Text className="text-2xl font-extrabold text-white">Staff POS Terminal</Text>
              <Text className="text-xs text-slate-400">Shift Operator: Priya S. (Cashier 01)</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/')}
            className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg"
          >
            <Text className="text-xs font-semibold text-slate-400">Exit POS</Text>
          </TouchableOpacity>
        </View>

        {/* Floorplan Table Grid */}
        <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Dine-In Table Floorplan
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          <View className="flex-row space-x-3">
            {MOCK_TABLES.map((tbl) => (
              <TouchableOpacity
                key={tbl.id}
                onPress={() => setSelectedTable(tbl.label)}
                className={`p-3.5 rounded-xl border w-32 ${
                  selectedTable === tbl.label
                    ? 'bg-amber-500/20 border-amber-500'
                    : tbl.status === 'OCCUPIED'
                    ? 'bg-indigo-950/60 border-indigo-500/30'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-base font-extrabold text-white">{tbl.label}</Text>
                  <Badge label={tbl.status} variant={tbl.status} size="sm" />
                </View>
                <Text className="text-[10px] text-slate-400">{tbl.section} • {tbl.capacity} Seats</Text>
                {tbl.total ? (
                  <Text className="text-xs font-bold text-amber-400 mt-2">{tbl.total}</Text>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Menu Category Filter Bar */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Menu Item Catalog
          </Text>
          <View className="flex-row space-x-2">
            {['ALL', 'STARTERS', 'MAINS', 'BREADS', 'BEVERAGES'].map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg border ${
                  selectedCategory === cat
                    ? 'bg-amber-500 border-amber-500'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    selectedCategory === cat ? 'text-slate-950' : 'text-slate-400'
                  }`}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Menu Items Grid */}
        <ScrollView className="flex-1">
          <View className="flex-row flex-wrap gap-3">
            {filteredMenu.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => addToCart(item)}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-4 rounded-xl flex-1 min-w-[200px] justify-between shadow-sm"
              >
                <View>
                  <Text className="text-base font-bold text-white mb-1">{item.name}</Text>
                  <Text className="text-xs text-slate-400 line-clamp-2">{item.desc}</Text>
                </View>
                <View className="flex-row justify-between items-center mt-3 pt-2 border-t border-slate-800">
                  <Text className="text-sm font-extrabold text-amber-400">₹{item.price}</Text>
                  <View className="bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    <Text className="text-[10px] font-bold text-amber-400">+ Add</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Right Drawer: Live Cart & Bill Builder */}
      <View className="w-96 bg-slate-900 border-l border-slate-800 p-5 justify-between">
        <View className="flex-1">
          {/* Cart Header */}
          <View className="flex-row justify-between items-center pb-4 border-b border-slate-800 mb-4">
            <View>
              <Text className="text-lg font-bold text-white">Order Cart ({selectedTable})</Text>
              <Text className="text-xs text-slate-400">Customer: Dine-In Guest</Text>
            </View>
            {cart.length > 0 && (
              <TouchableOpacity onPress={() => setCart([])}>
                <Text className="text-xs font-bold text-rose-400">Clear</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Cart Items */}
          <ScrollView className="flex-1">
            {cart.length === 0 ? (
              <View className="py-16 items-center justify-center">
                <Ionicons name="cart-outline" size={40} color="#334155" />
                <Text className="text-slate-500 text-xs mt-2 font-medium">Cart is empty</Text>
                <Text className="text-slate-600 text-[10px] mt-0.5">Click menu items on the left to add</Text>
              </View>
            ) : (
              cart.map((item) => (
                <View
                  key={item.id}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-2 flex-row justify-between items-center"
                >
                  <View className="flex-1 pr-2">
                    <Text className="text-sm font-bold text-white">{item.name}</Text>
                    <Text className="text-xs text-amber-400 font-semibold">₹{item.price * item.qty}</Text>
                  </View>

                  <View className="flex-row items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
                    <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                      <Text className="text-xs font-bold text-slate-400 px-1">-</Text>
                    </TouchableOpacity>
                    <Text className="text-xs font-bold text-white">{item.qty}</Text>
                    <TouchableOpacity onPress={() => addToCart(item)}>
                      <Text className="text-xs font-bold text-amber-400 px-1">+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>

        {/* Cart Summary & Checkout */}
        {cart.length > 0 && (
          <View className="pt-4 border-t border-slate-800">
            <View className="space-y-1.5 mb-4">
              <View className="flex-row justify-between">
                <Text className="text-xs text-slate-400">Subtotal</Text>
                <Text className="text-xs font-semibold text-slate-200">₹{subtotal}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-slate-400">GST Tax (5%)</Text>
                <Text className="text-xs font-semibold text-slate-200">₹{tax}</Text>
              </View>
              <View className="flex-row justify-between pt-2 border-t border-slate-800">
                <Text className="text-base font-bold text-white">Grand Total</Text>
                <Text className="text-xl font-extrabold text-amber-400">₹{grandTotal}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setShowCheckoutModal(true)}
              className="bg-amber-500 hover:bg-amber-400 p-4 rounded-xl items-center shadow-lg shadow-amber-500/25"
            >
              <Text className="text-slate-950 font-extrabold text-base">Proceed to Checkout →</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Checkout Modal */}
      <Modal
        visible={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        title="Checkout & Payment"
        subtitle={`Table ${selectedTable} • Total ₹${grandTotal}`}
      >
        <View className="space-y-4">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Select Payment Method
          </Text>

          <View className="flex-row gap-3 mb-4">
            {(['UPI', 'CARD', 'CASH'] as const).map((method) => (
              <TouchableOpacity
                key={method}
                onPress={() => setPaymentMethod(method)}
                className={`flex-1 p-3.5 rounded-xl border items-center ${
                  paymentMethod === method
                    ? 'bg-amber-500/20 border-amber-500'
                    : 'bg-slate-950 border-slate-800'
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
                  size={24}
                  color={paymentMethod === method ? '#f59e0b' : '#94a3b8'}
                />
                <Text
                  className={`text-xs font-bold mt-1 ${
                    paymentMethod === method ? 'text-amber-400' : 'text-slate-400'
                  }`}
                >
                  {method}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => {
              alert(`Payment of ₹${grandTotal} captured via ${paymentMethod}! Order sent to Kitchen.`);
              setCart([]);
              setShowCheckoutModal(false);
            }}
            className="bg-emerald-500 hover:bg-emerald-400 p-4 rounded-xl items-center shadow-lg shadow-emerald-500/25"
          >
            <Text className="text-slate-950 font-extrabold text-base">Confirm Payment & Dispatch Order ✓</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
