<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const products = ref([])

onMounted(async () => {
  const res = await fetch('http://localhost:5000/api/products')
  products.value = await res.json()
})

const viewDetails = (id) => router.push(`/admin/products/${id}`)
const editProduct = (id) => router.push(`/admin/products/edit/${id}`)
const addProduct = () => router.push('/admin/add-product')
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
        <h2>All products</h2>
        <p>Inventory / Product list</p>
      </div>
      <div class="ap-header-right">
        <span class="ap-count">{{ products.length }} items</span>
        <button class="ap-btn-add" @click="addProduct">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add product
        </button>
      </div>
    </div>

    <div class="ap-table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in products" :key="item._id || item.id">
            <td class="td-num">{{ String(index + 1).padStart(2, '0') }}</td>

            <td>
              <img
                :src="`http://localhost:5000/uploads/${item.image}`"
                :alt="item.title"
                class="td-thumb"
              />
            </td>

            <td class="td-title">{{ item.title }}</td>
            <td class="td-desc">{{ item.description }}</td>
            <td class="td-price">₹ {{ Number(item.amount).toLocaleString('en-IN') }}</td>

            <td>
              <div class="td-actions">
                <button class="btn-details" @click="viewDetails(item._id || item.id)">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  Details
                </button>
                <button class="btn-edit" @click="editProduct(item._id || item.id)">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  Edit
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="ap-footer">
      <span class="ap-footer-note">Showing 1–{{ products.length }} of {{ products.length }}</span>
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

.ap-card { font-family: 'DM Sans', sans-serif; background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; overflow: hidden; }
.ap-header { padding: 18px 22px; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; gap: 12px; }
.ap-icon { width: 36px; height: 36px; border-radius: 8px; background: #eff6ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ap-icon svg { width: 16px; height: 16px; color: #2563eb; }
.ap-header-text h2 { font-size: 15px; font-weight: 600; margin: 0 0 2px; color: #111; }
.ap-header-text p { font-size: 11.5px; color: #9ca3af; margin: 0; font-family: 'DM Mono', monospace; }
.ap-header-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
.ap-count { font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 99px; background: #f3f4f6; color: #6b7280; font-family: 'DM Mono', monospace; border: 1px solid #e5e7eb; }
.ap-btn-add { font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; padding: 7px 14px; border-radius: 8px; border: none; background: #1d4ed8; color: #fff; cursor: pointer; display: flex; align-items: center; gap: 5px; }
.ap-btn-add svg { width: 13px; height: 13px; }
.ap-btn-add:hover { background: #1e40af; }
.ap-table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
thead tr { background: #f9fafb; }
th { padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #f0f0f0; white-space: nowrap; }
td { padding: 12px 16px; border-bottom: 1px solid #f5f5f5; vertical-align: middle; color: #111; }
tbody tr:last-child td { border-bottom: none; }
tbody tr:hover { background: #fafafa; }
.td-num { font-family: 'DM Mono', monospace; font-size: 12px; color: #9ca3af; }
.td-thumb { width: 52px; height: 52px; border-radius: 8px; object-fit: cover; border: 1px solid #e5e7eb; display: block; }
.td-title { font-weight: 500; }
.td-desc { color: #6b7280; font-size: 13px; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.td-price { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 500; color: #2563eb; white-space: nowrap; }
.td-actions { display: flex; gap: 6px; align-items: center; }
.btn-details { font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; padding: 6px 11px; border-radius: 7px; border: 1px solid #e5e7eb; background: transparent; color: #6b7280; cursor: pointer; display: flex; align-items: center; gap: 4px; white-space: nowrap; }
.btn-details svg { width: 12px; height: 12px; }
.btn-details:hover { background: #f3f4f6; }
.btn-edit { font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; padding: 6px 11px; border-radius: 7px; border: none; background: #d97706; color: #fff; cursor: pointer; display: flex; align-items: center; gap: 4px; white-space: nowrap; }
.btn-edit svg { width: 12px; height: 12px; }
.btn-edit:hover { background: #b45309; }
.ap-footer { padding: 12px 22px; border-top: 1px solid #f0f0f0; background: #f9fafb; }
.ap-footer-note { font-size: 12px; color: #9ca3af; font-family: 'DM Mono', monospace; }
</style>