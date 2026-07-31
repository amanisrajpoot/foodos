import { View } from 'react-native';

export default function FullScreenLayout({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-1 bg-black">
      {children}
    </View>
  );
}
