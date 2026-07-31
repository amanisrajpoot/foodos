import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  organizationId: string | null;
  role: string | null;
  login: (user: any, role: string, orgId?: string) => void;
  logout: () => void;
  setOrganization: (id: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  organizationId: null,
  role: null,
  login: (user, role, orgId) => set({ isAuthenticated: true, user, role, organizationId: orgId || null }),
  logout: () => set({ isAuthenticated: false, user: null, role: null, organizationId: null }),
  setOrganization: (id) => set({ organizationId: id }),
}));
