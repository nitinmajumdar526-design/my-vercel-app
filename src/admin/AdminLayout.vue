<script setup>
import AdminNavbar from './AdminNavbar.vue'
import AdminSidebar from './AdminSidebar.vue'
</script>

<template>
  <div class="admin-layout">
    <AdminSidebar />

    <div class="admin-main">
      <AdminNavbar />
      <main>
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f4f7ff;
}

.admin-main {
  flex: 1;
}

main {
  padding: 25px;
}
</style>