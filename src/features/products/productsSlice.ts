import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { Product } from '../../types'

interface ApiProduct {
  id: number
  title: string
  description: string
  category: string
  image: string
  price: number
}

interface ProductsState {
  items: Product[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

function isApiProduct(value: unknown): value is ApiProduct {
  if (typeof value !== 'object' || value === null) return false

  const product = value as Record<string, unknown>
  return (
    Number.isInteger(product.id) &&
    typeof product.title === 'string' &&
    typeof product.description === 'string' &&
    typeof product.category === 'string' &&
    typeof product.image === 'string' &&
    typeof product.price === 'number' &&
    Number.isFinite(product.price)
  )
}

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('https://fakestoreapi.com/products')
    if (!response.ok) {
      return rejectWithValue(
        `Không thể tải sản phẩm (HTTP ${response.status}).`,
      )
    }

    const data: unknown = await response.json()
    if (!Array.isArray(data) || !data.every(isApiProduct)) {
      return rejectWithValue('Dữ liệu sản phẩm từ máy chủ không hợp lệ.')
    }

    return data.map((product) => ({
      id: product.id,
      name: product.title,
      description: product.description,
      category: product.category,
      image: product.image,
      price: product.price,
    }))
  } catch (error) {
    console.error('Không thể tải danh sách sản phẩm.', error)
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : 'Đã xảy ra lỗi không xác định khi tải sản phẩm.',
    )
  }
})

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error =
          action.payload ?? action.error.message ?? 'Không thể tải sản phẩm.'
      })
  },
})

export default productsSlice.reducer
