<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const title = ref('')
const images = ref([])
const imagesLabel = ref('Click to upload multiple images')

const handleImages = (e) => {
  const files = Array.from(e.target.files)
  images.value = files
  imagesLabel.value = files.length
    ? `${files.length} file${files.length > 1 ? 's' : ''} selected`
    : 'Click to upload multiple images'
}

const addGallery = async () => {
  const formData = new FormData()
  formData.append('title', title.value)
  images.value.forEach((img) => formData.append('images', img))

  const res = await fetch('http://localhost:5000/api/gallery', {
    method: 'POST',
    body: formData
  })

  const data = await res.json()
  alert(data.message)

  if (res.ok) {
    router.push('/admin/gallery')
  }
}
</script>

<template>
  <div class="ap-card">

    <div class="ap-header">
      <div class="ap-icon">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <div class="ap-header-text">
        <h2>Add gallery</h2>
        <p>Gallery / New entry</p>
      </div>
      <span class="ap-badge">New</span>
    </div>

    <div class="ap-body">

      <div class="ap-field">
        <label>Gallery title</label>
        <input v-model="title" type="text" placeholder="Gallery title" required />
      </div>

      <div class="ap-images-section">
        <span class="field-label">Upload images</span>
        <label class="ap-dropzone">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M3 16.5V19a1.5 1.5 0 001.5 1.5h15A1.5 1.5 0 0021 19v-2.5M16 9l-4-4-4 4M12 5v11" />
          </svg>
          <span>{{ imagesLabel }}</span>
          <small>PNG, JPG, WEBP — multiple allowed</small>
          <input type="file" multiple accept="image/*" @change="handleImages" style="display:none" />
        </label>
      </div>

    </div>

    <div class="ap-footer">
      <span class="ap-note">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Images will be saved on submit
      </span>
      <div class="ap-btn-group">
        <button class="ap-btn-submit" @click="addGallery">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Create gallery
        </button>
        <button class="ap-btn-cancel" @click="router.push('/admin/gallery')">Cancel</button>
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
.ap-badge { margin-left: auto; font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 99px; background: #d1fae5; color: #065f46; text-transform: uppercase; letter-spacing: 0.04em; flex-shrink: 0; }
.ap-body { padding: 20px 22px; display: flex; flex-direction: column; gap: 16px; }
.ap-field { display: flex; flex-direction: column; gap: 5px; }
.ap-images-section { display: flex; flex-direction: column; gap: 7px; }
.ap-field label, .field-label { font-size: 11.5px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
.ap-field input { font-family: 'DM Sans', sans-serif; font-size: 13.5px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 9px 12px; outline: none; transition: border-color 0.15s; width: 100%; color: #111; }
.ap-field input:focus { border-color: #f59e0b; background: #fff; box-shadow: 0 0 0 3px rgba(245,158,11,0.1); }
.ap-dropzone { border: 1.5px dashed #d1d5db; border-radius: 8px; background: #f9fafb; padding: 18px 16px; display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; transition: border-color 0.15s, background 0.15s; }
.ap-dropzone:hover { border-color: #f59e0b; background: #fffbeb; }
.ap-dropzone svg { width: 20px; height: 20px; color: #9ca3af; margin-bottom: 2px; }
.ap-dropzone span { font-size: 13px; color: #6b7280; }
.ap-dropzone small { font-size: 11px; color: #9ca3af; font-family: 'DM Mono', monospace; }
.ap-footer { padding: 14px 22px; border-top: 1px solid #f0f0f0; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: #f9fafb; }
.ap-note { font-size: 12px; color: #9ca3af; display: flex; align-items: center; gap: 5px; }
.ap-note svg { width: 13px; height: 13px; flex-shrink: 0; }
.ap-btn-group { display: flex; gap: 8px; }
.ap-btn-cancel { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; padding: 8px 16px; border-radius: 8px; border: 1px solid #e5e7eb; background: transparent; color: #6b7280; cursor: pointer; }
.ap-btn-submit { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; padding: 8px 18px; border-radius: 8px; border: none; background: #d97706; color: #fff; cursor: pointer; display: flex; align-items: center; gap: 6px; }
.ap-btn-submit svg { width: 14px; height: 14px; }
.ap-btn-submit:hover { background: #b45309; }
</style>