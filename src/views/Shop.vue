<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()
const products = ref([])
const loading = ref(true)
const added = ref(null)

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/products')
    products.value = await res.json()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

const addToCart = async (product) => {
  try {
    // ✅ Session se sahi tarike se user nikalo
    const raw = localStorage.getItem('customer')
    if (!raw) {
      alert('Please login first ❌')
      router.push('/login')
      return
    }

    const session = JSON.parse(raw)

    // ✅ Expire check
    if (session.expiresAt && Date.now() > session.expiresAt) {
      localStorage.removeItem('customer')
      router.push('/login')
      return
    }

    // ✅ session.user se id nikalo
    const customerId = session.user?.id
    const productId  = product.id

    if (!customerId || !productId) {
      alert('Customer ya product missing ❌')
      console.log('Session:', session)
      return
    }

    const res = await fetch('http://localhost:5000/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId,
        productId,
        quantity: 1,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message || 'Cart error ❌')
      return
    }

    added.value = productId
    setTimeout(() => (added.value = null), 1500)

  } catch (err) {
    console.error(err)
    alert('Cart error ❌')
  }
}
</script>

<template>
  <div>
    <Navbar />

    <section class="shop">
      <div class="top-bar">
        <button class="back-btn" @click="router.back()">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 3L5 8L10 13"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Back
        </button>
      </div>

      <div class="shop-header">
        <span class="section-tag">Our Collection</span>
        <h1 class="shop-title">Find Your Perfect Pair</h1>
        <p class="shop-sub">Premium shoes for every occasion</p>
      </div>

      <div v-if="loading" class="grid">
        <div v-for="n in 6" :key="n" class="card skeleton">
          <div class="sk-img"></div>
          <div class="sk-line wide"></div>
          <div class="sk-line narrow"></div>
          <div class="sk-btn"></div>
        </div>
      </div>

      <div v-else class="grid">
        <div v-for="p in products" :key="p.id || p._id" class="card">
          <span v-if="p.tag" class="tag" :class="p.tag.toLowerCase()">
            {{ p.tag }}
          </span>

          <div class="card-image-wrapper">
            <img
              :src="`http://localhost:5000/uploads/${p.image}`"
              :alt="p.title"
              class="card-img"
            />
          </div>

          <div class="card-body">
            <h2 class="card-title">{{ p.title }}</h2>
            <p class="card-desc">{{ p.description }}</p>

            <div class="card-footer">
              <span class="card-price">
                ₹{{ Number(p.amount).toLocaleString('en-IN') }}
              </span>

              <button
                class="btn-cart"
                :class="{ added: added === (p.id || p._id) }"
                @click="addToCart(p)"
              >
                <svg
                  v-if="added === (p.id || p._id)"
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                >
                  <path
                    d="M2.5 7.5L6 11L12.5 4"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <svg
                  v-else
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                >
                  <path
                    d="M1 1h2l1.5 7.5h7L13 5H4"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <circle cx="7" cy="13" r="1" fill="currentColor" />
                  <circle cx="11" cy="13" r="1" fill="currentColor" />
                </svg>

                {{ added === (p.id || p._id) ? 'Added!' : 'Add to Cart' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:ital,wght@0,400;0,500&display=swap');

.shop {
  background: #f7f6f2;
  min-height: 100vh;
  padding: 36px 40px 80px;
  font-family: 'DM Sans', sans-serif;
}

.top-bar {
  max-width: 1200px;
  margin: 0 auto 32px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #555;
  background: #fff;
  border: 1px solid #e5e2da;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, transform 0.15s;
}

.back-btn:hover {
  background: #1a1a1a;
  color: #fff;
  border-color: #1a1a1a;
  transform: translateX(-2px);
}

.shop-header {
  text-align: center;
  margin-bottom: 52px;
}

.section-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #8b7355;
  background: #ede9e0;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 14px;
}

.shop-title {
  font-family: 'Syne', sans-serif;
  font-size: 40px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 10px;
  letter-spacing: -0.025em;
}

.shop-sub {
  font-size: 16px;
  color: #888077;
  margin: 0;
}

.grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 28px;
}

.card {
  background: #fff;
  border-radius: 20px;
  border: 1px solid #ece9e1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.09);
}

.tag {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 1;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 6px;
}

.tag.popular {
  background: #fef3c7;
  color: #b45309;
}

.tag.sale {
  background: #fee2e2;
  color: #dc2626;
}

.tag.new {
  background: #d1fae5;
  color: #059669;
}

.card-image-wrapper {
  background: #f5f3ef;
  height: 210px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 20px;
  transition: transform 0.4s ease;
}

.card:hover .card-img {
  transform: scale(1.07);
}

.card-body {
  padding: 20px 22px 22px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.card-title {
  font-family: 'Syne', sans-serif;
  font-size: 17px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: -0.01em;
}

.card-desc {
  font-size: 13px;
  color: #9c9286;
  line-height: 1.55;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #f0ece4;
}

.card-price {
  font-family: 'Syne', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
}

.btn-cart {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  background: #1a1a1a;
  border: none;
  padding: 9px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  white-space: nowrap;
}

.btn-cart:hover {
  background: #333;
  transform: scale(1.04);
}

.btn-cart:active {
  transform: scale(0.97);
}

.btn-cart.added {
  background: #059669;
}

.btn-cart.added:hover {
  background: #047857;
}

.skeleton {
  pointer-events: none;
}

.sk-img {
  height: 210px;
  background: linear-gradient(90deg, #ede9e0 25%, #e5e1d8 50%, #ede9e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.sk-line {
  height: 14px;
  border-radius: 6px;
  margin: 10px 22px 0;
  background: linear-gradient(90deg, #ede9e0 25%, #e5e1d8 50%, #ede9e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.sk-line.wide {
  width: calc(100% - 44px);
}

.sk-line.narrow {
  width: 50%;
}

.sk-btn {
  height: 38px;
  border-radius: 10px;
  margin: 16px 22px 22px;
  background: linear-gradient(90deg, #ede9e0 25%, #e5e1d8 50%, #ede9e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}

@media (max-width: 768px) {
  .shop {
    padding: 24px 16px 60px;
  }

  .shop-title {
    font-size: 28px;
  }

  .card-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .btn-cart {
    width: 100%;
    justify-content: center;
  }
}
</style>