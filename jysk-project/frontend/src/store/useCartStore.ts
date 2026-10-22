import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../features/catalog/types';

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  totalPrice: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem, quantity = 1) => set((state) => {
        const existingItem = state.items.find(item => item.id === newItem.id);
        
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.id === newItem.id 
                ? { ...item, quantity: item.quantity + quantity } 
                : item
            )
          };
        }
        
        return { items: [...state.items, { ...newItem, quantity }] };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      })),

      totalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'hyggy-cart-storage',
    }
  )
);