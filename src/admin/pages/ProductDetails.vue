<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const product = ref(null)

onMounted(async () => {
  const res = await fetch(`http://localhost:5000/api/products/${route.params.id}`)
  product.value = await res.json()
})
</script>

<template>
  <div v-if="product" class="ap-card">

    <div class="ap-header">
      <div class="ap-icon">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
      </div>
      <div class="ap-header-text">
        <h2>Product details</h2>
        <p>Inventory / View entry</p>
      </div>
      <span class="ap-badge">Active</span>
    </div>

    <div class="ap-body">

      <!-- Product Image -->
      <div class="ap-image-block">
        <img :src="`http://localhost:5000/uploads/${product.image}`" :alt="product.title" />
      </div>

      <!-- Title & Price -->
      <div class="ap-meta">
        <p class="ap-title">{{ product.title }}</p>
        <p class="ap-price">₹ {{ Number(product.amount).toLocaleString('en-IN') }}</p>
      </div>

      <div class="ap-divider"></div>

      <!-- Description -->
      <div>
        <p class="ap-section-label">Description</p>
        <p class="ap-desc">{{ product.description }}</p>
      </div>

      <!-- Info Grid -->
      <div class="ap-info-grid">
        
        <div class="ap-info-item">
          <small>Product ID</small>
          <span>#{{ product._id?.slice(-5) || product.id }}</span>
        </div>

        <div class="ap-info-item">
          <small>Status</small>
          <span>Published</span>
        </div>
      </div>

    </div>

    <div class="ap-footer">
      <span class="ap-note">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"/>
        </svg>
        Read-only view
      </span>
      <div class="ap-btn-group">

        <button class="ap-btn-edit" @click="router.push(`/admin/products/edit/${product._id || product.id}`)">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          Edit product
        </button>
        <button class="ap-btn-back" @click="router.back()">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
      
      </div>
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

.ap-card { font-family: 'DM Sans', sans-serif; background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; overflow: hidden; max-width: 1220px; }
.ap-header { padding: 18px 22px; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; gap: 12px; }
.ap-icon { width: 36px; height: 36px; border-radius: 8px; background: #eff6ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ap-icon svg { width: 16px; height: 16px; color: #2563eb; }
.ap-header-text h2 { font-size: 15px; font-weight: 600; margin: 0 0 2px; color: #111; }
.ap-header-text p { font-size: 11.5px; color: #9ca3af; margin: 0; font-family: 'DM Mono', monospace; }
.ap-badge { margin-left: auto; font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 99px; background: #dcfce7; color: #15803d; text-transform: uppercase; letter-spacing: 0.04em; flex-shrink: 0; }
.ap-body { padding: 20px 22px; display: flex; flex-direction: column; gap: 16px; }
.ap-image-block { border-radius: 10px; overflow: hidden; background: #f3f4f6; border: 1px solid #e5e7eb; width: 100%; aspect-ratio: 16/9; }
.ap-image-block img { margin: 70px 330px; width: 40%; height: 60%; object-fit: cover; display: block; }
.ap-meta { display: flex; flex-direction: column; gap: 4px; }
.ap-title { font-size: 17px; font-weight: 600; color: #111; margin: 0; }
.ap-price { font-size: 14px; font-weight: 500; color: #2563eb; font-family: 'DM Mono', monospace; margin: 2px 0 0; }
.ap-divider { height: 1px; background: #f0f0f0; }
.ap-section-label { font-size: 11.5px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px; }
.ap-desc { font-size: 13.5px; color: #6b7280; line-height: 1.7; margin: 0; }
.ap-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.ap-info-item { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 12px; }
.ap-info-item small { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.04em; display: block; margin-bottom: 3px; }
.ap-info-item span { font-size: 13px; font-weight: 500; color: #111; font-family: 'DM Mono', monospace; }
.ap-footer { padding: 14px 22px; border-top: 1px solid #f0f0f0; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: #f9fafb; }
.ap-note { font-size: 12px; color: #9ca3af; display: flex; align-items: center; gap: 5px; }
.ap-note svg { width: 13px; height: 13px; }
.ap-btn-group { display: flex; gap: 8px; }
.ap-btn-back { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; padding: 8px 16px; border-radius: 8px; border: 1px solid #e5e7eb; background: transparent; color: #6b7280; cursor: pointer; display: flex; align-items: center; gap: 6px; }
.ap-btn-back svg { width: 13px; height: 13px; }
.ap-btn-edit { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; padding: 8px 18px; border-radius: 8px; border: none; background: #d97706; color: #fff; cursor: pointer; display: flex; align-items: center; gap: 6px; }
.ap-btn-edit svg { width: 14px; height: 14px; }
.ap-btn-edit:hover { background: #b45309; }
</style>