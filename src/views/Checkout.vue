<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter }                from 'vue-router'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'

const router  = useRouter()
const cart    = ref(JSON.parse(localStorage.getItem('cart') || '[]'))
const address = ref(null)
const placing = ref(false)
const ordered = ref(false)

const total = computed(() =>
  cart.value.reduce((sum, i) => sum + (i.price || i.amount) * i.qty, 0)
)

const getUser = () => {
  const raw = localStorage.getItem('customer')
  if (!raw) return null
  try {
    const session = JSON.parse(raw)
    return session.expiresAt && Date.now() < session.expiresAt ? session.user : null
  } catch { return null }
}

onMounted(async () => {
  const user = getUser()
  if (!user) { router.push('/login'); return }

  try {
    const res  = await fetch(`http://localhost:5000/api/user/get-address/${user.id}`)
    const data = await res.json()
    if (data.address) {
      address.value = data.address
    } else {
      router.push('/add-address')
    }
  } catch (err) {
    console.error('Address fetch error:', err)
  }
})

const placeOrder = async () => {
  const user = getUser()
  if (!user || !address.value) return

  placing.value = true
  try {
    const res = await fetch('http://localhost:5000/api/orders/place', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id:    user.id,
        address_id: address.value.id,
        items: cart.value.map(i => ({
          product_id: i.id,
          qty:        i.qty,
          price:      i.price || i.amount,
        })),
        total: total.value,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message || 'Order place nahi hua')
      return
    }

    localStorage.removeItem('cart')
    cart.value  = []
    ordered.value = true

  } catch (err) {
    alert('Error: ' + err.message)
  } finally {
    placing.value = false
  }
}
</script>

<template>
  <div>
    <Navbar />

    <div class="checkout-page">

      <!-- ✅ Success Screen -->
      <div v-if="ordered" class="success-box">
        <div class="success-icon">✓</div>
        <h2>Order Placed!</h2>
        <p>Aapka order successfully place ho gaya hai.</p>
        <button @click="router.push('/shop')" class="btn-dark">
          Continue Shopping
        </button>
      </div>

      <!-- ✅ Checkout Layout -->
      <div v-else class="checkout-grid">

        <!-- Left -->
        <div class="left-col">

          <!-- Address -->
          <h2 class="section-title">Delivery Address</h2>
          <div v-if="address" class="address-card">
            <div class="address-top">
              <span class="address-badge">📍 Home</span>
              <button class="change-btn" @click="router.push('/add-address')">Change</button>
            </div>
            <p class="address-name">{{ address.full_name }}</p>
            <p class="address-line">{{ address.phone }}</p>
            <p class="address-line">{{ address.city }}</p>
            <p class="address-line">{{ address.address }}</p>
          </div>
          <div v-else class="loading-box">Loading address...</div>

          <!-- Items -->
          <h2 class="section-title" style="margin-top: 32px;">
            Order Items ({{ cart.length }})
          </h2>
          <div class="items-list">
            <div v-for="item in cart" :key="item.id" class="order-item">
              <div class="order-img-wrap">
                <img
                  :src="item.img || `http://localhost:5000/uploads/${item.image}`"
                  :alt="item.title"
                  class="order-img"
                />
              </div>
              <div class="order-info">
                <p class="order-title">{{ item.title }}</p>
                <p class="order-qty">Qty: {{ item.qty }}</p>
              </div>
              <p class="order-price">
                ₹{{ Number((item.price || item.amount) * item.qty).toLocaleString('en-IN') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Right: Summary -->
        <div class="right-col">
          <div class="summary-card">
            <h2 class="summary-title">Order Summary</h2>

            <div class="summary-rows">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>₹{{ total.toLocaleString('en-IN') }}</span>
              </div>
              <div class="summary-row">
                <span>Delivery</span>
                <span class="free">FREE</span>
              </div>
              <div class="summary-row">
                <span>Discount</span>
                <span>— ₹0</span>
              </div>
            </div>

            <div class="divider"></div>

            <div class="summary-total">
              <span>Total</span>
              <span>₹{{ total.toLocaleString('en-IN') }}</span>
            </div>

            <div class="payment-section">
              <p class="payment-label">Payment Method</p>
              <div class="payment-option">
                <span>💵</span>
                <span>Cash on Delivery</span>
              </div>
            </div>

            <button
              class="btn-place"
              @click="placeOrder"
              :disabled="placing || !address || cart.length === 0"
            >
              {{ placing ? 'Placing Order...' : 'Place Order' }}
              <svg v-if="!placing" width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M3 7.5h9M8 3.5l4 4-4 4" stroke="currentColor"
                      stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <button class="btn-back" @click="router.push('/cart')">
              ← Back to Cart
            </button>

            <div class="trust-row">
              <div class="trust-item">🔒 <span>Secure</span></div>
              <div class="trust-item">🚚 <span>Free Delivery</span></div>
              <div class="trust-item">↩️ <span>7-day Return</span></div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <Footer />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@400;500&display=swap');

.checkout-page {
  background: #f7f6f2;
  min-height: 100vh;
  padding: 48px 24px 88px;
  font-family: 'DM Sans', sans-serif;
}

.checkout-grid {
  max-width: 1060px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 32px;
  align-items: start;
}

.section-title {
  font-family: 'Syne', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px;
}

.address-card {
  background: #fff;
  border: 1px solid #ece9e1;
  border-radius: 16px;
  padding: 20px 22px;
  margin-bottom: 8px;
}

.address-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.address-badge {
  font-size: 12px;
  background: #d1fae5;
  color: #065f46;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 500;
}

.change-btn {
  font-size: 13px;
  color: #2563eb;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.address-name { font-weight: 600; color: #1a1a1a; margin: 0 0 4px; font-size: 15px; }
.address-line { font-size: 14px; color: #6b7280; margin: 0 0 3px; }
.loading-box  { color: #aaa; font-size: 14px; padding: 16px; }

.items-list { display: flex; flex-direction: column; gap: 12px; }

.order-item {
  background: #fff;
  border: 1px solid #ece9e1;
  border-radius: 14px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.order-img-wrap {
  width: 64px;
  height: 56px;
  background: #f5f3ef;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.order-img   { width: 56px; height: 48px; object-fit: contain; }
.order-info  { flex: 1; }
.order-title { font-size: 14px; font-weight: 500; color: #1a1a1a; margin: 0 0 4px; }
.order-qty   { font-size: 12px; color: #9c9286; margin: 0; }

.order-price {
  font-family: 'Syne', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  white-space: nowrap;
}

.right-col    { position: sticky; top: 88px; }

.summary-card {
  background: #fff;
  border: 1px solid #ece9e1;
  border-radius: 24px;
  padding: 28px 24px;
}

.summary-title {
  font-family: 'Syne', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 20px;
}

.summary-rows { display: flex; flex-direction: column; gap: 12px; }

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #9c9286;
}

.free    { color: #059669; font-weight: 500; }
.divider { height: 1px; background: #ece9e1; margin: 18px 0; }

.summary-total {
  display: flex;
  justify-content: space-between;
  font-family: 'Syne', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px;
}

.payment-section { margin-bottom: 20px; }
.payment-label   { font-size: 13px; color: #9c9286; margin: 0 0 8px; }

.payment-option {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  background: #f5f3ef;
  border: 1.5px solid #1a1a1a;
  border-radius: 10px;
  padding: 10px 14px;
}

.btn-place {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 50px;
  background: #1a1a1a;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}

.btn-place:hover:not(:disabled) { background: #333; transform: scale(1.02); }
.btn-place:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-back {
  width: 100%;
  height: 44px;
  background: transparent;
  color: #555;
  border: 1px solid #e5e1d8;
  border-radius: 12px;
  font-size: 13px;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.2s;
}

.btn-back:hover { background: #f5f3ef; }

.trust-row {
  display: flex;
  justify-content: space-between;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid #f0ece4;
}

.trust-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #9c9286;
}

.success-box {
  max-width: 440px;
  margin: 80px auto;
  text-align: center;
  background: #fff;
  border: 1px solid #ece9e1;
  border-radius: 24px;
  padding: 48px 36px;
}

.success-icon {
  width: 70px;
  height: 70px;
  background: #d1fae5;
  color: #059669;
  font-size: 32px;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.success-box h2 { font-family: 'Syne', sans-serif; font-size: 26px; color: #1a1a1a; margin: 0 0 10px; }
.success-box p  { font-size: 15px; color: #6b7280; margin: 0 0 24px; }

.btn-dark {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #1a1a1a;
  color: #fff;
  border: none;
  padding: 12px 28px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 768px) {
  .checkout-grid { grid-template-columns: 1fr; }
  .right-col     { position: static; }
}
</style>