import { create } from 'zustand';

export interface CartItem {
  id: string; // unique local id
  menuItemId: string;
  name: string;
  quantity: number;
  unitPriceMinor: number;
  specialInstructions?: string;
}

interface CartState {
  items: CartItem[];
  tableId?: string;
  channel: string;
  source: string;
  
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setTableId: (id?: string) => void;
  setChannel: (channel: string) => void;
  clearCart: () => void;
  
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  channel: 'DINE_IN',
  source: 'STAFF_POS',
  
  addItem: (item) => set((state) => {
    // Basic grouping if same item and same instructions
    const existing = state.items.find(i => 
      i.menuItemId === item.menuItemId && 
      i.specialInstructions === item.specialInstructions
    );
    if (existing) {
      return {
        items: state.items.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i)
      };
    }
    return {
      items: [...state.items, { ...item, id: Math.random().toString(36).substr(2, 9) }]
    };
  }),
  
  removeItem: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id)
  })),
  
  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map((i) => i.id === id ? { ...i, quantity } : i)
  })),
  
  setTableId: (tableId) => set({ tableId }),
  setChannel: (channel) => set({ channel }),
  
  clearCart: () => set({ items: [], tableId: undefined }),
  
  getSubtotal: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + (item.unitPriceMinor * item.quantity), 0);
  }
}));
