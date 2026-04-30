<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const menuOpen = ref(false)
const user = ref(null)
const cartCount = ref(0)

const links = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

const getSession = () => {
  const raw = localStorage.getItem('customer')
  if (!raw) return null

  try {
    const session = JSON.parse(raw)

    if (session.expiresAt && Date.now() > session.expiresAt) {
      localStorage.removeItem('customer')
      return null
    }

    return session
  } catch {
    return null
  }
}

const getCustomerId = (session) => {
  return Number(session?.user?.id || session?.id || session?.customer_id)
}

const fetchCartCount = async () => {
  const session = getSession()

  if (!session) {
    user.value = null
    cartCount.value = 0
    return
  }

  user.value = session.user || session

  const customerId = getCustomerId(session)

  if (!customerId) {
    cartCount.value = 0
    return
  }

  try {
    const res = await fetch(`http://localhost:5000/api/cart/${customerId}`)
    const items = await res.json()

    if (!res.ok || !Array.isArray(items)) {
      cartCount.value = 0
      return
    }

    cartCount.value = items.reduce((sum, item) => {
      return sum + Number(item.quantity || item.qty || 1)
    }, 0)
  } catch (err) {
    console.error('Cart count error:', err)
    cartCount.value = 0
  }
}

const loadUserAndCart = () => {
  fetchCartCount()
}

onMounted(() => {
  loadUserAndCart()
  window.addEventListener('cart-updated', loadUserAndCart)
  window.addEventListener('storage', loadUserAndCart)
})

onUnmounted(() => {
  window.removeEventListener('cart-updated', loadUserAndCart)
  window.removeEventListener('storage', loadUserAndCart)
})

watch(() => route.path, loadUserAndCart)

const logout = () => {
  localStorage.removeItem('customer')
  user.value = null
  cartCount.value = 0
  window.dispatchEvent(new Event('cart-updated'))
  router.push('/login')
}
</script>

<template>
  <nav class="navbar">
    <div class="nav-container">
      <h1 class="logo" @click="router.push('/')">👟 ShoeStore</h1>

      <ul class="nav-links" :class="{ open: menuOpen }">
        <li v-for="link in links" :key="link.path">
          <router-link :to="link.path" @click="menuOpen = false">
            {{ link.name }}
          </router-link>
        </li>
      </ul>

      <span v-if="user" class="user-name">
        Hi, {{ user.name || user.email }}
      </span>

      <router-link to="/cart" class="cart-btn">
        🛒 Cart
        <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
      </router-link>

      <button v-if="user" class="auth-btn logout" @click="logout">Logout</button>
      <button v-else class="auth-btn login" @click="router.push('/login')">Login</button>

      <button class="hamburger" @click="menuOpen = !menuOpen">
        {{ menuOpen ? '✕' : '☰' }}
      </button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: #1b1b1c;
  padding: 16px 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1100px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  flex-wrap: wrap;
}

.logo {
  color: white;
  font-size: 22px;
  margin: 0;
  cursor: pointer;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 30px;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: #d1d5db;
  text-decoration: none;
  font-size: 15px;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #60a5fa;
}

.cart-btn {
  position: relative;
  color: white;
  background: #2563eb;
  padding: 8px 14px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.auth-btn {
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.login {
  background: #10b981;
  color: white;
}

.logout {
  background: #ef4444;
  color: white;
}

.user-name {
  color: #9ca3af;
  font-size: 14px;
}

.hamburger {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 22px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .hamburger {
    display: block;
  }

  .nav-links {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background: #1b1b1c;
    padding: 20px;
    gap: 20px;
  }

  .nav-links.open {
    display: flex;
  }
}
</style>