import {
  combineReducers,
  configureStore,
  type Middleware,
} from '@reduxjs/toolkit'
import { saveCartItems } from './cartStorage'
import cartReducer, {
  addToCart,
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  setCartStorageError,
} from './features/cart/cartSlice'
import productsReducer from './features/products/productsSlice'

const rootReducer = combineReducers({
  cart: cartReducer,
  products: productsReducer,
})

export type RootState = ReturnType<typeof rootReducer>

const cartPersistenceMiddleware: Middleware<{}, RootState> =
  (api) => (next) => (action) => {
    const result = next(action)

    if (
      addToCart.match(action) ||
      increaseQuantity.match(action) ||
      decreaseQuantity.match(action) ||
      removeFromCart.match(action) ||
      clearCart.match(action)
    ) {
      try {
        saveCartItems(api.getState().cart.items)
        api.dispatch(setCartStorageError(null))
      } catch (error) {
        console.error('Không thể lưu giỏ hàng vào localStorage.', error)
        api.dispatch(
          setCartStorageError(
            error instanceof Error
              ? error.message
              : 'Không thể lưu giỏ hàng trên thiết bị này.',
          ),
        )
      }
    }

    return result
  }

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartPersistenceMiddleware),
})

export type AppDispatch = typeof store.dispatch
