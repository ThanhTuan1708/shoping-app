import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  addToCart,
  applyDiscount,
  clearCart,
  clearDiscount,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  setShippingCost,
} from './features/cart/cartSlice'
import {
  selectCartItems,
  selectCartSummary,
} from './features/cart/cartSelectors'
import { fetchProducts } from './features/products/productsSlice'
import { useAppDispatch, useAppSelector } from './hooks'
import './App.css'

const discountCodes: Record<string, number> = {
  SUMMER10: 10,
  SPECIAL20: 20,
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)

function App() {
  const dispatch = useAppDispatch()
  const products = useAppSelector((state) => state.products.items)
  const productsStatus = useAppSelector((state) => state.products.status)
  const productsError = useAppSelector((state) => state.products.error)
  const cartItems = useAppSelector(selectCartItems)
  const summary = useAppSelector(selectCartSummary)
  const discountCode = useAppSelector((state) => state.cart.discountCode)
  const shippingCost = useAppSelector((state) => state.cart.shippingCost)
  const storageError = useAppSelector((state) => state.cart.storageError)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [discountInput, setDiscountInput] = useState('')
  const [discountMessage, setDiscountMessage] = useState('')
  const [checkoutMessage, setCheckoutMessage] = useState('')

  useEffect(() => {
    if (productsStatus === 'idle') {
      void dispatch(fetchProducts())
    }
  }, [dispatch, productsStatus])

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))],
    [products],
  )

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    return products.filter((product) => {
      const matchesCategory = category === 'all' || product.category === category
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [category, products, search])

  const handleDiscountSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const code = discountInput.trim().toUpperCase()

    if (!discountCodes[code]) {
      setDiscountMessage('Mã giảm giá không hợp lệ.')
      return
    }

    dispatch(applyDiscount(code))
    setDiscountInput('')
    setDiscountMessage(`Đã áp dụng mã ${code}.`)
  }

  const handleCheckout = () => {
    setCheckoutMessage('Thanh toán trực tuyến chưa được cấu hình cho cửa hàng demo.')
  }

  return (
    <div className="storefront">
      <header className="site-header">
        <a className="brand" href="#" aria-label="Northstar Market - trang chủ">
          <span className="brand-mark" aria-hidden="true">
            N
          </span>
          <span>
            NORTHSTAR
            <small>MARKET</small>
          </span>
        </a>
        <div className="header-note">Đồ tốt. Lựa chọn có chủ đích.</div>
        <a className="header-cart" href="#cart">
          Giỏ hàng <span>{summary.itemCount}</span>
        </a>
      </header>

      <main>
        <section className="intro">
          <p className="eyebrow">BỘ SƯU TẬP ĐƯỢC TUYỂN CHỌN</p>
          <h1>Những món đồ<br />đáng để giữ lại.</h1>
          <p className="intro-copy">
            Khám phá các sản phẩm thiết yếu cho cuộc sống hằng ngày — được chọn
            vì chất lượng, thiết kế và giá trị lâu dài.
          </p>
          <a className="text-link" href="#products">
            Khám phá cửa hàng <span aria-hidden="true">↓</span>
          </a>
          <div className="intro-index" aria-hidden="true">
            <span>01</span>
            <i />
            <span>03</span>
          </div>
        </section>

        <section className="shop-layout" id="products">
          <div className="catalog">
            <div className="section-heading">
              <div>
                <p className="eyebrow">MUA SẮM</p>
                <h2>Sản phẩm nổi bật</h2>
              </div>
              <span className="product-count">
                {productsStatus === 'succeeded'
                  ? `${visibleProducts.length} sản phẩm`
                  : 'Đang cập nhật'}
              </span>
            </div>

            <div className="catalog-tools">
              <label className="search-field">
                <span className="sr-only">Tìm sản phẩm</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="10.8" cy="10.8" r="6.8" />
                  <path d="m16 16 4.5 4.5" />
                </svg>
                <input
                  type="search"
                  placeholder="Tìm sản phẩm..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <label className="category-select">
                <span className="sr-only">Lọc theo danh mục</span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <option value="all">Tất cả danh mục</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {productsStatus === 'loading' && (
              <div className="state-panel" role="status">
                <span className="loading-spinner" />
                <p>Đang tải những lựa chọn mới...</p>
              </div>
            )}

            {productsStatus === 'failed' && (
              <div className="state-panel error-panel" role="alert">
                <p>{productsError}</p>
                <button
                  className="button button-dark"
                  onClick={() => void dispatch(fetchProducts())}
                >
                  Thử tải lại
                </button>
              </div>
            )}

            {productsStatus === 'succeeded' && visibleProducts.length === 0 && (
              <div className="state-panel">
                <p>Không tìm thấy sản phẩm phù hợp.</p>
              </div>
            )}

            {productsStatus === 'succeeded' && visibleProducts.length > 0 && (
              <div className="product-grid">
                {visibleProducts.map((product, index) => (
                  <article className="product-card" key={product.id}>
                    <div className="product-image">
                      <span className="product-number">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <img src={product.image} alt={product.name} loading="lazy" />
                    </div>
                    <div className="product-meta">
                      <span>{product.category}</span>
                      <span>{formatPrice(product.price)}</span>
                    </div>
                    <h3>{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <button
                      className="add-button"
                      onClick={() => dispatch(addToCart(product))}
                    >
                      <span>Thêm vào giỏ</span>
                      <span aria-hidden="true">+</span>
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>

          <aside className="cart-panel" id="cart">
            <div className="cart-title">
              <div>
                <p className="eyebrow">ĐƠN HÀNG CỦA BẠN</p>
                <h2>Giỏ hàng</h2>
              </div>
              <span className="cart-count">{summary.itemCount}</span>
            </div>

            {storageError && (
              <p className="notice error-notice" role="alert">
                {storageError}
              </p>
            )}

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <span className="empty-cart-icon" aria-hidden="true">＋</span>
                <p>Chiếc giỏ này vẫn đang chờ món đồ đầu tiên.</p>
                <a href="#products">Khám phá sản phẩm</a>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <article className="cart-item" key={item.id}>
                      <img src={item.image} alt="" />
                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <span>{formatPrice(item.price)}</span>
                        <div className="quantity-control">
                          <button
                            aria-label={`Giảm số lượng ${item.name}`}
                            onClick={() => dispatch(decreaseQuantity(item.id))}
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            aria-label={`Tăng số lượng ${item.name}`}
                            onClick={() => dispatch(increaseQuantity(item.id))}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="cart-item-end">
                        <strong>{formatPrice(item.price * item.quantity)}</strong>
                        <button
                          className="remove-button"
                          aria-label={`Xóa ${item.name} khỏi giỏ`}
                          onClick={() => dispatch(removeFromCart(item.id))}
                        >
                          Xóa
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <button
                  className="clear-cart"
                  onClick={() => dispatch(clearCart())}
                >
                  Xóa toàn bộ giỏ hàng
                </button>
              </>
            )}

            <div className="discount-block">
              <label htmlFor="discount-code">Mã giảm giá</label>
              <form className="discount-form" onSubmit={handleDiscountSubmit}>
                <input
                  id="discount-code"
                  value={discountInput}
                  onChange={(event) => {
                    setDiscountInput(event.target.value)
                    setDiscountMessage('')
                  }}
                  placeholder="Nhập mã giảm giá"
                  autoComplete="off"
                />
                <button type="submit">Áp dụng</button>
              </form>
              <p className="discount-hint">Thử SUMMER10 hoặc SPECIAL20</p>
              {discountMessage && (
                <p className="form-message" role="status">{discountMessage}</p>
              )}
              {discountCode && (
                <div className="applied-code">
                  <span>
                    {discountCode} · giảm {discountCodes[discountCode] ?? 0}%
                  </span>
                  <button
                    onClick={() => {
                      dispatch(clearDiscount())
                      setDiscountMessage('')
                    }}
                  >
                    Gỡ
                  </button>
                </div>
              )}
            </div>

            <fieldset className="shipping-options">
              <legend>Phương thức giao hàng</legend>
              <label>
                <input
                  type="radio"
                  name="shipping"
                  checked={shippingCost === 0}
                  onChange={() => dispatch(setShippingCost(0))}
                />
                <span>Tiêu chuẩn miễn phí</span>
                <strong>{formatPrice(0)}</strong>
              </label>
              <label>
                <input
                  type="radio"
                  name="shipping"
                  checked={shippingCost === 10}
                  onChange={() => dispatch(setShippingCost(10))}
                />
                <span>Tiêu chuẩn · 3–5 ngày</span>
                <strong>{formatPrice(10)}</strong>
              </label>
              <label>
                <input
                  type="radio"
                  name="shipping"
                  checked={shippingCost === 25}
                  onChange={() => dispatch(setShippingCost(25))}
                />
                <span>Giao hàng nhanh · 1–2 ngày</span>
                <strong>{formatPrice(25)}</strong>
              </label>
            </fieldset>

            <div className="order-summary">
              <div>
                <span>Tạm tính</span>
                <span>{formatPrice(summary.subtotal)}</span>
              </div>
              {summary.discount > 0 && (
                <div className="discount-row">
                  <span>Giảm giá</span>
                  <span>−{formatPrice(summary.discount)}</span>
                </div>
              )}
              <div>
                <span>Thuế (10%)</span>
                <span>{formatPrice(summary.tax)}</span>
              </div>
              <div>
                <span>Giao hàng</span>
                <span>{formatPrice(summary.shipping)}</span>
              </div>
              <div className="summary-total">
                <strong>Tổng thanh toán</strong>
                <strong>{formatPrice(summary.total)}</strong>
              </div>
              <button
                className="checkout-button"
                disabled={cartItems.length === 0}
                onClick={handleCheckout}
              >
                Tiếp tục thanh toán <span aria-hidden="true">↗</span>
              </button>
              {checkoutMessage && (
                <p className="checkout-message" role="status">
                  {checkoutMessage}
                </p>
              )}
              <p className="secure-note">
                <span aria-hidden="true">◇</span> Thanh toán an toàn và bảo mật
              </p>
            </div>
          </aside>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#">
          <span className="brand-mark" aria-hidden="true">N</span>
          <span>NORTHSTAR<small>MARKET</small></span>
        </a>
        <p>Chọn ít hơn. Chọn tốt hơn.</p>
        <span>© 2026 Northstar Market</span>
      </footer>
    </div>
  )
}

export default App
