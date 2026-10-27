import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { loadCartItems } from '../../cartStorage'
import type { CartItem, Product } from '../../types'

const storedCart = loadCartItems()

export interface CartState {
  items: CartItem[]
  discountCode: string | null
  taxRate: number
  shippingCost: number
  storageError: string | null
}

const initialState: CartState = {
  items: storedCart.items,
  discountCode: null,
  taxRate: 0.1,
  shippingCost: 10,
  storageError: storedCart.error,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      )

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
    },
    increaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((cartItem) => cartItem.id === action.payload)
      if (item) item.quantity += 1
    },
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((cartItem) => cartItem.id === action.payload)
      if (item && item.quantity > 1) item.quantity -= 1
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    clearCart: (state) => {
      state.items = []
    },
    applyDiscount: (state, action: PayloadAction<string>) => {
      state.discountCode = action.payload.trim().toUpperCase()
    },
    clearDiscount: (state) => {
      state.discountCode = null
    },
    setShippingCost: (state, action: PayloadAction<number>) => {
      state.shippingCost = action.payload
    },
    setCartStorageError: (state, action: PayloadAction<string | null>) => {
      state.storageError = action.payload
    },
  },
})

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  applyDiscount,
  clearDiscount,
  setShippingCost,
  setCartStorageError,
} = cartSlice.actions

export default cartSlice.reducer
