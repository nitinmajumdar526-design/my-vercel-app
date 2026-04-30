<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const totalProducts = ref(0)
const totalUsers = ref(0)
const orders = ref(0)
const recentProducts = ref([])

onMounted(async () => {
  try {
    const productRes = await fetch('http://localhost:5000/api/products')
    const products = await productRes.json()
    totalProducts.value = products.length
    recentProducts.value = products.slice(0, 3)

    const userRes = await fetch('http://localhost:5000/api/users')
    const users = await userRes.json()
    totalUsers.value = users.length
  } catch (err) {
    console.log(err)
  }
})
</script>

<template>
  <div class="dash">

    <!-- Page Header -->
    <div class="dash-header">
      <div class="dash-header-left">
        <h2>Dashboard</h2>
        <p>Admin / Overview</p>
      </div>
      <span class="dash-badge">Live</span>
    </div>

    <!-- Stat Cards -->
    <div class="cards">
      <div class="card">
        <div class="card-top">
          <div class="card-icon blue">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8a1 1 0 00-1 1v3h10V4a1 1 0 00-1-1z" />
            </svg>
          </div>
          <span class="card-trend up">+12%</span>
        </div>
        <div class="card-bottom">
          <span class="card-value">{{ totalProducts }}</span>
          <span class="card-label">Total Products</span>
          <span class="card-sub">In inventory</span>
        </div>
      </div>

      <div class="card">
        <div class="card-top">
          <div class="card-icon purple">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <span class="card-trend up">+5%</span>
        </div>
        <div class="card-bottom">
          <span class="card-value">{{ totalUsers }}</span>
          <span class="card-label">Total Users</span>
          <span class="card-sub">Registered accounts</span>
        </div>
      </div>

      <div class="card">
        <div class="card-top">
          <div class="card-icon amber">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7h13M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
          </div>
          <span class="card-trend neutral">—</span>
        </div>
        <div class="card-bottom">
          <span class="card-value">{{ orders }}</span>
          <span class="card-label">Orders</span>
          <span class="card-sub">Total placed</span>
        </div>
      </div>
    </div>

    <!-- Recent Products -->
    <div class="recent-block">
      <div class="recent-header">
        <span>Recent products</span>
        <a @click="router.push('/admin/products')">View all →</a>
      </div>
      <div
        v-for="(item, index) in recentProducts"
        :key="item._id || item.id"
        class="recent-row"
        @click="router.push(`/admin/products/${item._id || item.id}`)"
      >
        <span class="recent-num">{{ String(index + 1).padStart(2, '0') }}</span>
        <div class="recent-thumb">
          <img
            v-if="item.image"
            :src="`http://localhost:5000/uploads/${item.image}`"
            :alt="item.title"
            class="recent-img"
          />
          <svg v-else fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
          </svg>
        </div>
        <div class="recent-info">
          <span>{{ item.title }}</span>
          <small>{{ item.sku || `PRD-${String(index + 1).padStart(4, '0')}` }}</small>
        </div>
        <span class="recent-price">₹ {{ Number(item.amount).toLocaleString('en-IN') }}</span>
      </div>
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

* { box-sizing: border-box; }
.dash { font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 16px; }
.dash-header { display: flex; align-items: center; justify-content: space-between; }
.dash-header-left h2 { font-size: 17px; font-weight: 600; margin: 0 0 3px; color: #111; }
.dash-header-left p { font-size: 12px; color: #9ca3af; margin: 0; font-family: 'DM Mono', monospace; }
.dash-badge { font-size: 11px; font-weight: 500; padding: 4px 12px; border-radius: 99px; background: #dcfce7; color: #15803d; text-transform: uppercase; letter-spacing: 0.04em; }
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.card { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 18px 20px; display: flex; flex-direction: column; gap: 14px; }
.card-top { display: flex; align-items: center; justify-content: space-between; }
.card-icon { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.card-icon svg { width: 15px; height: 15px; }
.card-icon.blue { background: #eff6ff; }
.card-icon.blue svg { color: #2563eb; }
.card-icon.purple { background: #f5f3ff; }
.card-icon.purple svg { color: #7c3aed; }
.card-icon.amber { background: #fffbeb; }
.card-icon.amber svg { color: #d97706; }
.card-trend { font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 99px; }
.card-trend.up { background: #dcfce7; color: #15803d; }
.card-trend.neutral { background: #f3f4f6; color: #6b7280; }
.card-value { font-size: 28px; font-weight: 600; color: #111; font-family: 'DM Mono', monospace; line-height: 1; }
.card-label { font-size: 12px; color: #6b7280; font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em; margin-top: 4px; }
.card-sub { font-size: 11.5px; color: #9ca3af; margin-top: 2px; }
.recent-block { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; overflow: hidden; }
.recent-header { padding: 14px 20px; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; justify-content: space-between; }
.recent-header span { font-size: 13px; font-weight: 600; color: #111; }
.recent-header a { font-size: 12px; color: #2563eb; cursor: pointer; font-weight: 500; }
.recent-row { display: flex; align-items: center; gap: 12px; padding: 11px 20px; border-bottom: 1px solid #f5f5f5; cursor: pointer; transition: background 0.1s; }
.recent-row:last-child { border-bottom: none; }
.recent-row:hover { background: #fafafa; }
.recent-num { font-size: 11.5px; color: #9ca3af; font-family: 'DM Mono', monospace; width: 20px; flex-shrink: 0; }
.recent-thumb { width: 36px; height: 36px; border-radius: 7px; background: #f3f4f6; border: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
.recent-thumb svg { width: 14px; height: 14px; color: #9ca3af; }
.recent-img { width: 100%; height: 100%; object-fit: cover; }
.recent-info { flex: 1; min-width: 0; }
.recent-info span { font-size: 13px; font-weight: 500; color: #111; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.recent-info small { font-size: 11.5px; color: #9ca3af; font-family: 'DM Mono', monospace; }
.recent-price { font-size: 13px; font-weight: 500; color: #2563eb; font-family: 'DM Mono', monospace; flex-shrink: 0; }
</style>