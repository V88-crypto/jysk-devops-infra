import { create } from 'zustand'

import { cartApi } from '@/shared/api/cartApi'
import type { CartEntry } from '@/shared/api/cartApi'
import type { CartItem } from '@/features/catalog/types'

interface CartState {
  items: CartItem[]
  isLoading: boolean
  pendingVariantId: number | null
  error: string | null
  loadCart: () => Promise<void>
  addItem: (variantId: number, quantity: number) => Promise<void>
  removeItem: (variantId: number) => Promise<void>
  updateQuantity: (variantId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  clear: () => void
  totalPrice: () => number
  totalItems: () => number
}

const toCartItem = (entry: CartEntry): CartItem => entry

const setItems = (entries: CartEntry[]) => ({
  items: entries.map(toCartItem),
  error: null,
})

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  isLoading: false,
  pendingVariantId: null,
  error: null,

  loadCart: async () => {
    set({ isLoading: true, error: null })
    try {
      const entries = await cartApi.list()
      set({ ...setItems(entries), isLoading: false })
    } catch (error) {
      set({ isLoading: false, error: error instanceof Error ? error.message : 'Не вдалося завантажити кошик' })
    }
  },

  addItem: async (variantId, quantity) => {
    set({ pendingVariantId: variantId, error: null })
    try {
      const entries = await cartApi.add(variantId, quantity)
      set({ ...setItems(entries), pendingVariantId: null })
    } catch (error) {
      set({
        pendingVariantId: null,
        error: error instanceof Error ? error.message : 'Не вдалося додати товар до кошика',
      })
      throw error
    }
  },

  removeItem: async (variantId) => {
    set({ pendingVariantId: variantId, error: null })
    try {
      await cartApi.remove(variantId)
      set((state) => ({
        items: state.items.filter((item) => item.variantId !== variantId),
        pendingVariantId: null,
      }))
    } catch (error) {
      set({
        pendingVariantId: null,
        error: error instanceof Error ? error.message : 'Не вдалося видалити товар',
      })
      throw error
    }
  },

  updateQuantity: async (variantId, quantity) => {
    if (quantity < 1) {
      return get().removeItem(variantId)
    }

    set({ pendingVariantId: variantId, error: null })
    try {
      const entries = await cartApi.update(variantId, quantity)
      set({ ...setItems(entries), pendingVariantId: null })
    } catch (error) {
      set({
        pendingVariantId: null,
        error: error instanceof Error ? error.message : 'Не вдалося змінити кількість',
      })
      throw error
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null })
    try {
      await cartApi.clear()
      set({ items: [], isLoading: false })
    } catch (error) {
      set({ isLoading: false, error: error instanceof Error ? error.message : 'Не вдалося очистити кошик' })
      throw error
    }
  },

  clear: () => set({ items: [], error: null }),

  totalPrice: () =>
    get().items.reduce((total, item) => total + item.price * item.quantity, 0),

  totalItems: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),
}))
