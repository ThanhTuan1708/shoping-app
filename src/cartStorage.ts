import type { CartItem } from './types'

const STORAGE_KEY = 'shopping-cart-items'

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false

  const item = value as Record<string, unknown>
  return (
    Number.isInteger(item.id) &&
    typeof item.name === 'string' &&
    typeof item.description === 'string' &&
    typeof item.category === 'string' &&
    typeof item.image === 'string' &&
    typeof item.price === 'number' &&
    Number.isFinite(item.price) &&
    Number.isInteger(item.quantity) &&
    Number(item.quantity) > 0
  )
}

export function loadCartItems(): { items: CartItem[]; error: string | null } {
  if (typeof window === 'undefined') return { items: [], error: null }

  try {
    const storedItems = window.localStorage.getItem(STORAGE_KEY)
    if (!storedItems) return { items: [], error: null }

    const parsed: unknown = JSON.parse(storedItems)
    if (!Array.isArray(parsed) || !parsed.every(isCartItem)) {
      return {
        items: [],
        error: 'Dữ liệu giỏ hàng đã lưu không hợp lệ và không thể khôi phục.',
      }
    }

    return { items: parsed, error: null }
  } catch (error) {
    console.error('Không thể đọc giỏ hàng từ localStorage.', error)
    return {
      items: [],
      error: 'Không thể đọc giỏ hàng đã lưu trên thiết bị này.',
    }
  }
}

export function saveCartItems(items: CartItem[]) {
  if (typeof window === 'undefined') {
    throw new Error('localStorage không khả dụng trong môi trường hiện tại.')
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}
