import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../store'

const discountRates: Record<string, number> = {
  SUMMER10: 0.1,
  SPECIAL20: 0.2,
}

export const selectCartItems = (state: RootState) => state.cart.items

export const selectCartItemCount = (state: RootState) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0)

export const selectSubtotal = (state: RootState) =>
  state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )

export const selectDiscount = (state: RootState) => {
  const rate = state.cart.discountCode
    ? discountRates[state.cart.discountCode] ?? 0
    : 0
  return selectSubtotal(state) * rate
}

export const selectTax = (state: RootState) =>
  (selectSubtotal(state) - selectDiscount(state)) * state.cart.taxRate

export const selectCartTotal = (state: RootState) =>
  selectSubtotal(state) -
  selectDiscount(state) +
  selectTax(state) +
  state.cart.shippingCost

export const selectCartSummary = createSelector(
  [
    selectSubtotal,
    selectDiscount,
    selectTax,
    (state: RootState) => state.cart.shippingCost,
    selectCartTotal,
    selectCartItemCount,
  ],
  (subtotal, discount, tax, shipping, total, itemCount) => ({
    subtotal,
    discount,
    tax,
    shipping,
    total,
    itemCount,
  }),
)
