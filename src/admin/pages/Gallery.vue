<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const gallery = ref([])

onMounted(async () => {
  const res = await fetch('http://localhost:5000/api/gallery')
  gallery.value = await res.json()
})
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
        <h2>Gallery</h2>
        <p>Gallery / All entries</p>
      </div>
      <span class="ap-badge">{{ gallery.length }} Total</span>
      <button class="ap-btn-submit" @click="router.push('/admin/add-gallery')">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add Gallery
      </button>
    </div>

    <div class="ap-body">
      <div class="ap-table-wrap">
        <table class="ap-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Images</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in gallery" :key="item.id">
              <td>
                <span class="ap-index">{{ index + 1 }}</span>
              </td>
              <td>
                <span class="ap-title">{{ item.title }}</span>
              </td>
              <td>
                <div class="ap-thumb-row">
                  <div
                    v-for="img in item.images"
                    :key="img"
                    class="ap-thumb-wrap"
                  >
                    <img :src="`http://localhost:5000/uploads/${img}`" :alt="img" />
                  </div>
                </div>
              </td>
              <td>
                <div class="ap-action-group">
                  <button class="ap-btn-view" @click="router.push(`/admin/gallery/${item.id}`)">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </button>
                  <button class="ap-btn-edit" @click="router.push(`/admin/gallery/edit/${item.id}`)">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213l-4 1 1-4 12.362-12.726z" />
                    </svg>
                    Edit
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty state -->
            <tr v-if="gallery.length === 0">
              <td colspan="4" class="ap-empty">No galleries found</td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>

    <div class="ap-footer">
      <span class="ap-note">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Showing all galleries
      </span>
      <span class="ap-count-note">{{ gallery.length }} entr{{ gallery.length === 1 ? 'y' : 'ies' }} total</span>
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

* { box-sizing: border-box; }
.ap-card { font-family: 'DM Sans', sans-serif; background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; overflow: hidden; max-width: 1240px; }

/* Header */
.ap-header { padding: 18px 22px; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; gap: 12px; }
.ap-icon { width: 36px; height: 36px; border-radius: 8px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ap-icon svg { width: 16px; height: 16px; color: #d97706; }
.ap-header-text h2 { font-size: 15px; font-weight: 600; margin: 0 0 2px; color: #111; }
.ap-header-text p { font-size: 11.5px; color: #9ca3af; margin: 0; font-family: 'DM Mono', monospace; }
.ap-badge { margin-left: auto; font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 99px; background: #e0f2fe; color: #0369a1; text-transform: uppercase; letter-spacing: 0.04em; flex-shrink: 0; }

/* Body */
.ap-body { padding: 20px 22px; }
.ap-table-wrap { border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
.ap-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.ap-table thead tr { background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
.ap-table th { padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
.ap-table tbody tr { border-bottom: 1px solid #f3f4f6; transition: background 0.1s; }
.ap-table tbody tr:last-child { border-bottom: none; }
.ap-table tbody tr:hover { background: #fffbeb; }
.ap-table td { padding: 12px 14px; vertical-align: middle; color: #374151; }

/* Index */
.ap-index { font-family: 'DM Mono', monospace; font-size: 12px; color: #9ca3af; }

/* Title */
.ap-title { font-weight: 500; color: #111; }

/* Thumbnails */
.ap-thumb-row { display: flex; gap: 6px; flex-wrap: wrap; }
.ap-thumb-wrap { width: 48px; height: 48px; border-radius: 6px; overflow: hidden; border: 1px solid #e5e7eb; background: #f3f4f6; flex-shrink: 0; }
.ap-thumb-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* Action buttons */
.ap-action-group { display: flex; gap: 6px; }
.ap-btn-view { font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; padding: 6px 12px; border-radius: 7px; border: 1px solid #e5e7eb; background: #fff; color: #374151; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: background 0.15s, border-color 0.15s; }
.ap-btn-view svg { width: 13px; height: 13px; }
.ap-btn-view:hover { background: #f3f4f6; border-color: #d1d5db; }
.ap-btn-edit { font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; padding: 6px 12px; border-radius: 7px; border: none; background: #fef3c7; color: #b45309; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: background 0.15s; }
.ap-btn-edit svg { width: 13px; height: 13px; }
.ap-btn-edit:hover { background: #fde68a; }

/* Empty state */
.ap-empty { text-align: center; padding: 32px 14px; color: #9ca3af; font-size: 13px; font-family: 'DM Mono', monospace; }

/* Footer */
.ap-footer { padding: 14px 22px; border-top: 1px solid #f0f0f0; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: #f9fafb; }
.ap-note { font-size: 12px; color: #9ca3af; display: flex; align-items: center; gap: 5px; }
.ap-note svg { width: 13px; height: 13px; flex-shrink: 0; }
.ap-count-note { font-size: 12px; color: #9ca3af; font-family: 'DM Mono', monospace; }

/* Add button */
.ap-btn-submit { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; padding: 8px 18px; border-radius: 8px; border: none; background: #d97706; color: #fff; cursor: pointer; display: flex; align-items: center; gap: 6px; }
.ap-btn-submit svg { width: 14px; height: 14px; }
.ap-btn-submit:hover { background: #b45309; }
</style>