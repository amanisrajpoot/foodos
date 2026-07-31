import { View } from 'react-native';

export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-1 bg-white pb-16">
      {children}
      {/* Bottom tabs will be handled by expo-router's Tabs, this is just a wrapper if needed */}
    </View>
  );
}
