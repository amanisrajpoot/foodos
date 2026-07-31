import { View, Text } from 'react-native';

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-1 flex-row">
      <View className="w-64 bg-gray-900 h-full p-4">
        <Text className="text-white text-xl font-bold">FoodOS</Text>
      </View>
      <View className="flex-1 bg-gray-50 p-6">
        {children}
      </View>
    </View>
  );
}
