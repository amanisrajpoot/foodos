import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { useAuthStore } from '../../stores/auth.store';
import { Ionicons } from '@expo/vector-icons';

export default function OwnerLayout() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();

  const isMobile = width < 768;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  const navItems = [
    { label: 'Dashboard Hub', icon: 'grid-outline', route: '/(owner)' },
    { label: 'AI Copilot Feed', icon: 'sparkles-outline', route: '/(owner)/insights', badge: '✨ AI' },
    { label: 'Daily Business Summary', icon: 'document-text-outline', route: '/(owner)/reports/daily-summary' },
    { label: 'Brand Portfolio', icon: 'restaurant-outline', route: '/(owner)/restaurants' },
    { label: 'Inventory Center', icon: 'cube-outline', route: '/(owner)/inventory' },
    { label: 'Menu Catalog', icon: 'fast-food-outline', route: '/(owner)/menu' },
    { label: 'Finance & Ledger', icon: 'cash-outline', route: '/(owner)/finance' },
  ];

  const renderNavList = () => (
    <View style={{ gap: 6 }}>
      {navItems.map((item) => {
        const isActive = pathname === item.route;
        return (
          <Pressable
            key={item.route}
            onPress={() => {
              router.push(item.route as any);
              if (isMobile) setMobileMenuOpen(false);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 12,
              backgroundColor: isActive ? '#f59e0b' : 'transparent',
              borderWidth: isActive ? 0 : 1,
              borderColor: isActive ? 'transparent' : '#1e293b',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons
                name={item.icon as any}
                size={18}
                color={isActive ? '#0f172a' : '#94a3b8'}
                style={{ marginRight: 10 }}
              />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: isActive ? '700' : '600',
                  color: isActive ? '#0f172a' : '#e2e8f0',
                }}
              >
                {item.label}
              </Text>
            </View>
            {item.badge && !isActive && (
              <View
                style={{
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  borderWidth: 1,
                  borderColor: 'rgba(99, 102, 241, 0.4)',
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 6,
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#818cf8' }}>
                  {item.badge}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View style={{ flex: 1, flexDirection: isMobile ? 'column' : 'row', backgroundColor: '#030712' }}>
      {/* Mobile Top Navigation Header */}
      {isMobile && (
        <View
          style={{
            height: 60,
            backgroundColor: '#0f172a',
            borderBottomWidth: 1,
            borderBottomColor: '#1e293b',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            zIndex: 50,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: '#f59e0b',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}
            >
              <Ionicons name="restaurant" size={18} color="#0f172a" />
            </View>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#ffffff' }}>
              Food<Text style={{ color: '#f59e0b' }}>OS</Text>
            </Text>
          </View>

          <Pressable
            onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              padding: 8,
              borderRadius: 8,
              backgroundColor: '#1e293b',
            }}
          >
            <Ionicons name={mobileMenuOpen ? 'close' : 'menu'} size={22} color="#f59e0b" />
          </Pressable>
        </View>
      )}

      {/* Mobile Collapsible Navigation Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <View
          style={{
            position: 'absolute',
            top: 60,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#0f172a',
            zIndex: 40,
            padding: 20,
            justifyContent: 'space-between',
          }}
        >
          <ScrollView style={{ flex: 1 }}>{renderNavList()}</ScrollView>

          <View style={{ paddingTop: 16, borderTopWidth: 1, borderTopColor: '#1e293b' }}>
            <Pressable
              onPress={handleLogout}
              style={{
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: 'rgba(244, 63, 94, 0.1)',
                borderWidth: 1,
                borderColor: 'rgba(244, 63, 94, 0.2)',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#fb7185' }}>Sign Out</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Desktop / Tablet Fixed Sidebar */}
      {!isMobile && (
        <View
          style={{
            width: 260,
            backgroundColor: '#0f172a',
            borderRightWidth: 1,
            borderRightColor: '#1e293b',
            padding: 20,
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flex: 1 }}>
            {/* Brand Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 28 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: '#f59e0b',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                  shadowColor: '#f59e0b',
                  shadowRadius: 10,
                  shadowOpacity: 0.4,
                }}
              >
                <Ionicons name="restaurant" size={22} color="#0f172a" />
              </View>
              <View>
                <Text style={{ fontSize: 22, fontWeight: '800', color: '#ffffff' }}>
                  Food<Text style={{ color: '#f59e0b' }}>OS</Text>
                </Text>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#94a3b8', letterSpacing: 1.2 }}>
                  ENTERPRISE V2.4
                </Text>
              </View>
            </View>

            <ScrollView style={{ flex: 1 }}>{renderNavList()}</ScrollView>
          </View>

          {/* User Profile Footer */}
          <View style={{ paddingTop: 16, borderTopWidth: 1, borderTopColor: '#1e293b' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: '#334155',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#f59e0b' }}>EX</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#ffffff' }}>Exec Owner</Text>
                <Text style={{ fontSize: 11, color: '#64748b' }}>owner@foodos.app</Text>
              </View>
            </View>

            <Pressable
              onPress={handleLogout}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 12,
                backgroundColor: 'rgba(244, 63, 94, 0.1)',
                borderWidth: 1,
                borderColor: 'rgba(244, 63, 94, 0.2)',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#fb7185' }}>Sign Out</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Main Content Area */}
      <View style={{ flex: 1, backgroundColor: '#030712' }}>
        <Slot />
      </View>
    </View>
  );
}
