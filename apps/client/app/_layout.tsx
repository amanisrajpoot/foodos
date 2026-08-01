// @ts-ignore
import '../global.css';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { Stack as ExpoStack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../stores/auth.store';
import { ToastOverlay } from '../components/ui/ToastOverlay';

// Inject Web CSS Stylesheet Fallback
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const styleId = 'foodos-web-design-system';
  if (!document.getElementById(styleId)) {
    const styleTag = document.createElement('style');
    styleTag.id = styleId;
    styleTag.innerHTML = `
      body { background-color: #030712 !important; color: #f8fafc !important; font-family: system-ui, -apple-system, sans-serif !important; }
      .bg-slate-950 { background-color: #030712 !important; }
      .bg-slate-900 { background-color: #0f172a !important; }
      .bg-slate-800 { background-color: #1e293b !important; }
      .bg-slate-700 { background-color: #334155 !important; }
      .bg-amber-500 { background-color: #f59e0b !important; }
      .bg-indigo-600 { background-color: #4f46e5 !important; }
      .bg-emerald-600 { background-color: #059669 !important; }
      .bg-emerald-500 { background-color: #10b981 !important; }
      .bg-rose-500 { background-color: #f43f5e !important; }
      .text-white { color: #ffffff !important; }
      .text-slate-100 { color: #f1f5f9 !important; }
      .text-slate-200 { color: #e2e8f0 !important; }
      .text-slate-300 { color: #cbd5e1 !important; }
      .text-slate-400 { color: #94a3b8 !important; }
      .text-slate-500 { color: #64748b !important; }
      .text-amber-400 { color: #fbbf24 !important; }
      .text-indigo-400 { color: #818cf8 !important; }
      .text-emerald-400 { color: #34d399 !important; }
      .text-rose-400 { color: #fb7185 !important; }
      .flex-row { flex-direction: row !important; display: flex !important; }
      .flex-col { flex-direction: column !important; display: flex !important; }
      .flex-1 { flex: 1 1 0% !important; display: flex !important; }
      .items-center { align-items: center !important; }
      .justify-between { justify-content: space-between !important; }
      .justify-center { justify-content: center !important; }
      .rounded-3xl { border-radius: 1.5rem !important; }
      .rounded-2xl { border-radius: 1rem !important; }
      .rounded-xl { border-radius: 0.75rem !important; }
      .rounded-lg { border-radius: 0.5rem !important; }
      .rounded-full { border-radius: 9999px !important; }
      .border { border-style: solid !important; border-width: 1px !important; }
      .border-slate-800 { border-color: #1e293b !important; }
      .border-slate-700 { border-color: #334155 !important; }
      .p-4 { padding: 1rem !important; }
      .p-5 { padding: 1.25rem !important; }
      .p-6 { padding: 1.5rem !important; }
      .p-8 { padding: 2rem !important; }
      .py-10 { padding-top: 2.5rem !important; padding-bottom: 2.5rem !important; }
      .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
      .px-6 { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
      .px-8 { padding-left: 2rem !important; padding-right: 2rem !important; }
      .gap-4 { gap: 1rem !important; }
      .gap-3 { gap: 0.75rem !important; }
      .gap-2 { gap: 0.5rem !important; }
      .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5) !important; }
      .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.4) !important; }
    `;
    document.head.appendChild(styleTag);
  }
}

export default function RootLayout() {
  const { isAuthenticated, organizationId, role } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Force unauthenticated users to login
      router.replace('/(auth)/login');
    } else if (isAuthenticated) {
      if (!organizationId && segments[0] !== '(onboarding)') {
        // Force new users to onboarding
        router.replace('/(onboarding)/create-org');
      } else if (organizationId && (inAuthGroup || segments[0] === 'index' || segments[0] === undefined)) {
        // Authenticated users at root or auth pages go to their specific dashboard
        switch (role) {
          case 'OWNER':
            router.replace('/(owner)');
            break;
          case 'STAFF':
            router.replace('/(staff)');
            break;
          case 'DRIVER':
            router.replace('/(delivery)');
            break;
          case 'KITCHEN':
            router.replace('/(kitchen)');
            break;
          default:
            router.replace('/(auth)/login');
        }
      }
    }
  }, [isReady, isAuthenticated, organizationId, role, segments]);

  return (
    <View style={{ flex: 1 }}>
      <ExpoStack screenOptions={{ headerShown: false }} />
      <ToastOverlay />
    </View>
  );
}
