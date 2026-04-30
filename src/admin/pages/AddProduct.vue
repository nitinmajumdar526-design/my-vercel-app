<script setup>
import { ref } from 'vue'

const title = ref('')
const description = ref('')
const amount = ref('')
const sku = ref('')
const image = ref(null)
const imageLabel = ref('Click to upload or drag & drop')
const message = ref('')

const handleImage = (e) => {
  const file = e.target.files[0]
  image.value = file
  imageLabel.value = file ? file.name : 'Click to upload or drag & drop'
}

const addProduct = async () => {
  message.value = ''
  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('description', description.value)
  formData.append('amount', amount.value)
  formData.append('sku', sku.value)
  formData.append('image', image.value)

  try {
    const res = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    if (res.ok) {
      message.value = data.message
      title.value = ''
      description.value = ''
      amount.value = ''
      sku.value = ''
      image.value = null
      imageLabel.value = 'Click to upload or drag & drop'
    } else {
      message.value = data.message || 'Product add failed'
    }
  } catch (error) {
    message.value = 'Backend server band hai'
  }
}
</script>

<template>
  <div class="ap-card">

    <div class="ap-header">
      <div class="ap-icon">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8a1 1 0 00-1 1v3h10V4a1 1 0 00-1-1z" />
        </svg>
      </div>
      <div class="ap-header-text">
        <h2>Add product</h2>
        <p>Inventory / New entry</p>
      </div>
      <span class="ap-badge">Admin</span>
    </div>

    <div class="ap-body">
      <div class="ap-field">
        <label>Product title</label>
        <input v-model="title" type="text" placeholder="e.g. Premium Wireless Headphones" required />
      </div>

      <div class="ap-field">
        <label>Description</label>
        <textarea v-model="description" placeholder="Write a brief product description..." required></textarea>
      </div>

      <div class="ap-row">
        <div class="ap-field">
          <label>Price (₹)</label>
          <input v-model="amount" type="number" placeholder="0.00" required />
        </div>
        
      </div>

      <div class="ap-upload">
        <label class="field-label">Product image</label>
        <label class="ap-dropzone">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M3 16.5V19a1.5 1.5 0 001.5 1.5h15A1.5 1.5 0 0021 19v-2.5M16 9l-4-4-4 4M12 5v11" />
          </svg>
          <span>{{ imageLabel }}</span>
          <small>PNG, JPG, WEBP — max 5MB</small>
          <input type="file" accept="image/*" @change="handleImage" required style="display:none" />
        </label>
      </div>
    </div>

    <div class="ap-footer">
      <span class="ap-note">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
        </svg>
        {{ message || 'All fields are required' }}
      </span>
      <div class="ap-btn-group">
        <button class="ap-btn-cancel" type="button" @click="$emit('cancel')">Cancel</button>
        <button class="ap-btn-submit" type="button" @click="addProduct">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add product
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

.ap-card {
  font-family: 'DM Sans', sans-serif;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
  max-width: 1220px;
}

.ap-header {
  padding: 18px 22px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.ap-icon {
  width: 36px; height: 36px;
  border-radius: 8px;
  background: #eff6ff;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.ap-icon svg { width: 16px; height: 16px; color: #2563eb; }

.ap-header-text h2 { font-size: 15px; font-weight: 600; margin: 0 0 2px; color: #111; }
.ap-header-text p  { font-size: 11.5px; color: #9ca3af; margin: 0; font-family: 'DM Mono', monospace; }

.ap-badge {
  margin-left: auto; font-size: 11px; font-weight: 500;
  padding: 3px 10px; border-radius: 99px;
  background: #dcfce7; color: #15803d;
  text-transform: uppercase; letter-spacing: 0.04em;
}

.ap-body { padding: 20px 22px; display: flex; flex-direction: column; gap: 15px; }

.ap-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.ap-field, .ap-upload { display: flex; flex-direction: column; gap: 5px; }

.ap-field label, .field-label {
  font-size: 11.5px; font-weight: 500; color: #6b7280;
  text-transform: uppercase; letter-spacing: 0.05em;
}

.ap-field input, .ap-field textarea {
  font-family: 'DM Sans', sans-serif; font-size: 13.5px;
  background: #f9fafb; border: 1px solid #e5e7eb;
  border-radius: 8px; padding: 9px 12px; outline: none;
  transition: border-color 0.15s, box-shadow 0.15s; width: 100%; box-sizing: border-box;
}
.ap-field input:focus, .ap-field textarea:focus {
  border-color: #3b82f6; background: #fff;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
}
.ap-field textarea { resize: none; height: 86px; line-height: 1.6; }
.ap-field input[type="number"] { font-family: 'DM Mono', monospace; }

.ap-dropzone {
  border: 1.5px dashed #d1d5db; border-radius: 8px;
  background: #f9fafb; padding: 18px 16px;
  display: flex; flex-direction: column; align-items: center; gap: 5px;
  cursor: pointer; transition: border-color 0.15s, background 0.15s;
}
.ap-dropzone:hover { border-color: #3b82f6; background: #eff6ff; }
.ap-dropzone svg { width: 22px; height: 22px; color: #9ca3af; margin-bottom: 2px; }
.ap-dropzone span { font-size: 13px; color: #6b7280; }
.ap-dropzone small { font-size: 11px; color: #9ca3af; font-family: 'DM Mono', monospace; }

.ap-footer {
  padding: 14px 22px; border-top: 1px solid #f0f0f0;
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  background: #f9fafb;
}

.ap-note { font-size: 12px; color: #9ca3af; display: flex; align-items: center; gap: 5px; }
.ap-note svg { width: 13px; height: 13px; flex-shrink: 0; }

.ap-btn-group { display: flex; gap: 8px; }

.ap-btn-cancel {
  font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
  padding: 8px 16px; border-radius: 8px;
  border: 1px solid #e5e7eb; background: transparent; color: #6b7280; cursor: pointer;
}
.ap-btn-submit {
  font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
  padding: 8px 18px; border-radius: 8px; border: none;
  background: #1d4ed8; color: #fff; cursor: pointer;
  display: flex; align-items: center; gap: 6px;
}
.ap-btn-submit svg { width: 14px; height: 14px; }
.ap-btn-submit:hover { background: #1e40af; }
</style>