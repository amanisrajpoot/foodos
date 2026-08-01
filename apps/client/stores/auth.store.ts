import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  organizationId: string | null;
  restaurantId: string | null;
  branchId: string | null;
  role: string | null;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  setOrganization: (id: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  organizationId: null,
  restaurantId: null,
  branchId: null,
  role: null,
  login: async (email: string, password?: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    let role = 'OWNER';
    if (email.includes('staff')) role = 'STAFF';
    else if (email.includes('driver')) role = 'DRIVER';
    else if (email.includes('kitchen')) role = 'KITCHEN';

    const orgId = email.includes('new') ? null : '7ce267a4-8c78-4016-9e9a-6dd811a450e4';
    const restId = email.includes('new') ? null : '82524edd-f5d7-480d-953d-fdacd92cbb13';
    const bId = email.includes('new') ? null : '205b2068-c013-4295-bf14-0372c97e9174';

    set({ 
      isAuthenticated: true, 
      user: { id: `user_${Date.now()}`, email }, 
      role, 
      organizationId: orgId,
      restaurantId: restId,
      branchId: bId
    });
  },
  logout: () => set({ isAuthenticated: false, user: null, role: null, organizationId: null, restaurantId: null, branchId: null }),
  setOrganization: (id) => set({ organizationId: id }),
}));
