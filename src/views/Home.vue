<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import Hero from '../components/Hero.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()

const products = ref([])
const gallery = ref([])
const added = ref(null)

onMounted(async () => {
  try {
    const p = await fetch('http://localhost:5000/api/products')
    products.value = await p.json()

    const g = await fetch('http://localhost:5000/api/gallery')
    gallery.value = await g.json()
  } catch (err) {
    console.log(err)
  }
})

const getCustomer = () => {
  const raw = localStorage.getItem('customer')
  if (!raw) return null

  try {
    const data = JSON.parse(raw)
    return data.user ? data.user : data
  } catch {
    return null
  }
}

// Home.vue mein bhi yahi addToCart replace karo
const addToCart = async (product) => {
  try {
    const raw = localStorage.getItem('customer')

    if (!raw) {
      alert('Please login first ❌')
      router.push('/login')
      return
    }

    const session = JSON.parse(raw)

    if (session.expiresAt && Date.now() > session.expiresAt) {
      localStorage.removeItem('customer')
      alert('Session expired. Please login again ❌')
      router.push('/login')
      return
    }

    const customerId = Number(session.user?.id || session.id || session.customer_id)
    const productId = Number(product.id || product._id)

    console.log('ADD TO CART DEBUG:', {
      session,
      product,
      customerId,
      productId,
    })

    if (!customerId || !productId) {
      alert('Customer ya product missing ❌')
      return
    }

    const res = await fetch('http://localhost:5000/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        productId,
        quantity: 1,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message || 'Cart error ❌')
      console.log('CART API ERROR:', data)
      return
    }

    added.value = productId
    setTimeout(() => {
      added.value = null
    }, 1500)

    alert('Product added to cart ✅')
  } catch (err) {
    console.error('ADD TO CART ERROR:', err)
    alert('Cart error ❌')
  }
}
</script>

<template>
  <div>
    <Navbar />
    <Hero />

    <section class="products-section">
      <div class="section-header">
        <span class="section-tag">Our Collection</span>
        <h2 class="section-title">Featured Products</h2>
      </div>

      <div class="cards-grid">
        <div class="card" v-for="item in products" :key="item.id">
          <div class="card-image-wrapper">
            <img
              :src="`http://localhost:5000/uploads/${item.image}`"
              class="card-image"
            />
            <span class="card-badge">NEW</span>
          </div>

          <div class="card-body">
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-desc">{{ item.description }}</p>

            <div class="card-footer">
              <span class="card-price">
                ₹{{ Number(item.amount).toLocaleString('en-IN') }}
              </span>

              <button
                class="btn-cart"
                :class="{ added: added === item.id }"
                @click="addToCart(item)"
              >
                {{ added === item.id ? 'Added!' : 'Add to Cart' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="gallery-section">
      <div class="section-header">
        <span class="section-tag">Gallery</span>
        <h2 class="section-title">Our Gallery</h2>
      </div>

      <div class="gallery-grid">
        <div class="gallery-card" v-for="item in gallery" :key="item.id">
          <div class="gallery-item" v-for="img in item.images" :key="img">
            <img
              :src="`http://localhost:5000/uploads/${img}`"
              class="gallery-img"
            />

            <div class="overlay">
              <p>{{ item.title }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@400;500&display=swap');

.products-section,
.gallery-section {
  padding: 80px 40px;
  background: #f7f6f2;
  font-family: 'DM Sans', sans-serif;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-tag {
  background: #ede9e0;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  letter-spacing: 1px;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  margin-top: 10px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.card {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  transition: 0.3s;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.card-image-wrapper {
  height: 220px;
  background: #f5f3ef;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 20px;
  transition: 0.4s;
}

.card:hover .card-image {
  transform: scale(1.05);
}

.card-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: black;
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 10px;
}

.card-body {
  padding: 20px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
}

.card-desc {
  font-size: 14px;
  color: #777;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.card-price {
  font-size: 20px;
  font-weight: bold;
}

.btn-cart {
  background: black;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-cart.added {
  background: #059669;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.gallery-card {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
}

.gallery-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  transition: 0.4s;
}

.gallery-item:hover .gallery-img {
  transform: scale(1.12);
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  opacity: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  transition: 0.3s;
}

.overlay p {
  color: white;
  margin-bottom: 10px;
}

.gallery-item:hover .overlay {
  opacity: 1;
}

@media(max-width:900px){
  .cards-grid, .gallery-grid {
    grid-template-columns: repeat(2,1fr);
  }
}

@media(max-width:500px){
  .cards-grid, .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>