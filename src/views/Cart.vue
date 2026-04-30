<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()
const cart = ref([])
const loading = ref(true)

onMounted(async () => {
  await loadCart()
})

const getCustomer = () => {
  const raw = localStorage.getItem('customer')
  if (!raw) return null

  try {
    const data = JSON.parse(raw)

    if (data.expiresAt && Date.now() > data.expiresAt) {
      localStorage.removeItem('customer')
      return null
    }

    if (data.id) return data
    if (data.user && data.user.id) return data.user

    return null
  } catch {
    return null
  }
}

const safeJson = async (res) => {
  const text = await res.text()
  try {
    return text ? JSON.parse(text) : {}
  } catch {
    console.error('Invalid response:', text)
    return { message: 'Backend route error ❌' }
  }
}

const loadCart = async () => {
  try {
    const customer = getCustomer()

    if (!customer || !customer.id) {
      cart.value = []
      router.push('/login')
      return
    }

    const res = await fetch(`http://localhost:5000/api/cart/${customer.id}`)
    const data = await safeJson(res)

    if (!res.ok) {
      alert(data.message || 'Cart fetch failed ❌')
      return
    }

    cart.value = data
  } catch (err) {
    console.error(err)
    alert('Cart fetch failed ❌')
  } finally {
    loading.value = false
  }
}

const total = computed(() =>
  cart.value.reduce((sum, item) => {
    return sum + Number(item.amount) * Number(item.quantity)
  }, 0)
)

const remove = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/cart/${id}`, {
      method: 'DELETE',
    })

    const data = await safeJson(res)

    if (!res.ok) {
      alert(data.message || 'Remove failed ❌')
      return
    }

    cart.value = cart.value.filter((i) => i.id !== id)
  } catch (err) {
    console.error(err)
    alert('Remove failed ❌')
  }
}

const updateQty = async (item, delta) => {
  const newQty = Number(item.quantity) + delta

  if (newQty <= 0) {
    await remove(item.id)
    return
  }

  try {
    const res = await fetch(`http://localhost:5000/api/cart/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity: newQty,
      }),
    })

    const data = await safeJson(res)

    if (!res.ok) {
      alert(data.message || 'Quantity update failed ❌')
      return
    }

    item.quantity = newQty
  } catch (err) {
    console.error(err)
    alert('Quantity update failed ❌')
  }
}

const placeOrder = async () => {
  const customer = getCustomer()

  if (!customer || !customer.id) {
    router.push('/login')
    return
  }

  if (cart.value.length === 0) {
    alert('Cart is empty ❌')
    return
  }

  try {
    const res = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_id: customer.id,
      }),
    })

    const data = await safeJson(res)

    if (!res.ok) {
      alert(data.message || 'Order failed ❌')
      return
    }

    alert('Order placed successfully ✅')
    cart.value = []
    router.push('/shop')
  } catch (err) {
    console.error(err)
    alert('Order failed ❌')
  }
}
</script>

<template>
  <div>
    <Navbar />

    <div class="cart-page">
      <div class="hero-cart">
        <button class="back-btn" @click="router.back()">Back</button>

        <span class="hero-tag">My Bag</span>
        <h1 class="hero-title">Your Cart</h1>
        <p class="hero-sub">
          {{ cart.length }} item{{ cart.length !== 1 ? 's' : '' }} in your bag
        </p>
      </div>

      <div class="cart-body">
        <div v-if="loading" class="empty-state">
          <h2 class="empty-title">Loading cart...</h2>
        </div>

        <div v-else-if="cart.length === 0" class="empty-state">
          <h2 class="empty-title">Your cart is empty</h2>
          <p class="empty-sub">Looks like you haven't added anything yet.</p>

          <button class="btn-shop" @click="router.push('/shop')">
            Browse Collection
          </button>
        </div>

        <div v-else class="cart-grid">
          <div class="items-col">
            <div v-for="item in cart" :key="item.id" class="cart-item">
              <div class="item-img-wrap">
                <img
                  :src="`http://localhost:5000/uploads/${item.image}`"
                  :alt="item.title"
                  class="item-img"
                />
              </div>

              <div class="item-info">
                <h3 class="item-title">{{ item.title }}</h3>

                <p class="item-unit-price">
                  ₹{{ Number(item.amount).toLocaleString('en-IN') }} / pair
                </p>

                <div class="qty-row">
                  <button class="qty-btn" @click="updateQty(item, -1)">−</button>
                  <span class="qty-num">{{ item.quantity }}</span>
                  <button class="qty-btn" @click="updateQty(item, 1)">+</button>
                </div>
              </div>

              <div class="item-right">
                <p class="item-subtotal">
                  ₹{{ Number(item.amount * item.quantity).toLocaleString('en-IN') }}
                </p>

                <button class="remove-btn" @click="remove(item.id)">
                  Remove
                </button>
              </div>
            </div>
          </div>

          <div class="summary-col">
            <div class="summary-card">
              <h2 class="summary-title">Order Summary</h2>

              <div class="summary-row">
                <span>Subtotal</span>
                <span>₹{{ total.toLocaleString('en-IN') }}</span>
              </div>

              <div class="summary-row">
                <span>Delivery</span>
                <span class="free-tag">FREE</span>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-total">
                <span>Total</span>
                <span>₹{{ total.toLocaleString('en-IN') }}</span>
              </div>

              <button class="btn-checkout" @click="placeOrder">
                Place Order
              </button>

              <button class="btn-continue" @click="router.push('/shop')">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<style scoped>
.cart-page {
  background: #f7f6f2;
  min-height: 100vh;
}

.hero-cart {
  background: #1a1a1a;
  padding: 60px 24px;
  text-align: center;
  color: white;
}

.back-btn {
  margin-bottom: 20px;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.hero-tag {
  display: block;
  color: #c8a46b;
  margin-bottom: 10px;
}

.hero-title {
  font-size: 46px;
  margin: 0;
}

.hero-sub {
  color: #aaa;
}

.cart-body {
  max-width: 1100px;
  margin: auto;
  padding: 50px 24px;
}

.empty-state {
  text-align: center;
  padding: 70px 0;
}

.btn-shop,
.btn-checkout {
  background: #111;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
}

.cart-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 30px;
}

.cart-item {
  background: white;
  border-radius: 18px;
  padding: 20px;
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  align-items: center;
}

.item-img-wrap {
  width: 100px;
  height: 85px;
  background: #f5f3ef;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-img {
  width: 90px;
  height: 75px;
  object-fit: contain;
}

.item-info {
  flex: 1;
}

.item-title {
  margin: 0 0 8px;
}

.item-unit-price {
  color: #777;
  font-size: 14px;
}

.qty-row {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: #f5f3ef;
  padding: 6px 10px;
  border-radius: 10px;
}

.qty-btn {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
}

.qty-num {
  font-weight: bold;
}

.item-right {
  text-align: right;
}

.item-subtotal {
  font-size: 18px;
  font-weight: bold;
}

.remove-btn {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.summary-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
}

.summary-row,
.summary-total {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.summary-total {
  font-size: 20px;
  font-weight: bold;
}

.summary-divider {
  height: 1px;
  background: #ddd;
  margin: 20px 0;
}

.free-tag {
  color: green;
}

.btn-checkout,
.btn-continue {
  width: 100%;
  margin-top: 10px;
}

.btn-continue {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: transparent;
  cursor: pointer;
}

@media (max-width: 768px) {
  .cart-grid {
    grid-template-columns: 1fr;
  }

  .cart-item {
    flex-wrap: wrap;
  }
}
</style>