<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const gallery = ref(null)

onMounted(async () => {
  const res = await fetch(`http://localhost:5000/api/gallery/${route.params.id}`)
  gallery.value = await res.json()
})
</script>

<template>
  <div class="ap-card" v-if="gallery">

    <div class="ap-header">
      <div class="ap-icon">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <div class="ap-header-text">
        <h2>{{ gallery.title }}</h2>
        <p>Gallery / View entry</p>
      </div>
      <span class="ap-badge">{{ gallery.images.length }} Images</span>
    </div>

    <div class="ap-body">
      <div class="ap-images-section">
        <span class="field-label">Images ({{ gallery.images.length }})</span>
        <div class="ap-images-grid">
          <div
            v-for="(img, index) in gallery.images"
            :key="img"
            class="ap-img-wrap"
          >
            <img :src="`http://localhost:5000/uploads/${img}`" :alt="`img-${index + 1}`" />
            <span class="ap-img-tag">img-{{ index + 1 }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="ap-footer">
      <span class="ap-note">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Read-only view
      </span>
      <div class="ap-btn-group">
        <button class="ap-btn-submit" @click="router.push(`/admin/gallery/${route.params.id}/edit`)">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213l-4 1 1-4 12.362-12.726z" />
          </svg>
          Edit gallery
        </button>
        <button class="ap-btn-cancel" @click="router.push('/admin/gallery')">Back</button>
      </div>
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

* { box-sizing: border-box; }
.ap-card { font-family: 'DM Sans', sans-serif; background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; overflow: hidden; max-width: 1240px; }
.ap-header { padding: 18px 22px; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; gap: 12px; }
.ap-icon { width: 36px; height: 36px; border-radius: 8px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ap-icon svg { width: 16px; height: 16px; color: #d97706; }
.ap-header-text h2 { font-size: 15px; font-weight: 600; margin: 0 0 2px; color: #111; }
.ap-header-text p { font-size: 11.5px; color: #9ca3af; margin: 0; font-family: 'DM Mono', monospace; }
.ap-badge { margin-left: auto; font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 99px; background: #ede9fe; color: #6d28d9; text-transform: uppercase; letter-spacing: 0.04em; flex-shrink: 0; }
.ap-body { padding: 20px 22px; display: flex; flex-direction: column; gap: 16px; }
.ap-images-section { display: flex; flex-direction: column; gap: 7px; }
.field-label { font-size: 11.5px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
.ap-images-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.ap-img-wrap { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; background: #f3f4f6; }
.ap-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ap-img-tag { position: absolute; bottom: 5px; left: 5px; font-size: 10px; font-weight: 500; padding: 2px 6px; border-radius: 99px; background: rgba(0,0,0,0.5); color: #fff; font-family: 'DM Mono', monospace; }
.ap-footer { padding: 14px 22px; border-top: 1px solid #f0f0f0; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: #f9fafb; }
.ap-note { font-size: 12px; color: #9ca3af; display: flex; align-items: center; gap: 5px; }
.ap-note svg { width: 13px; height: 13px; flex-shrink: 0; }
.ap-btn-group { display: flex; gap: 8px; }
.ap-btn-cancel { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; padding: 8px 16px; border-radius: 8px; border: 1px solid #e5e7eb; background: transparent; color: #6b7280; cursor: pointer; }
.ap-btn-submit { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; padding: 8px 18px; border-radius: 8px; border: none; background: #d97706; color: #fff; cursor: pointer; display: flex; align-items: center; gap: 6px; }
.ap-btn-submit svg { width: 14px; height: 14px; }
.ap-btn-submit:hover { background: #b45309; }
</style>