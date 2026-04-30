<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>
  <nav class="admin-navbar">
    <h2>Admin Panel</h2>
    <button @click="logout">Logout</button>
  </nav>
</template>

<style scoped>
.admin-navbar {
  height: 70px;
  background: white;
  padding: 0 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

button {
  padding: 10px 18px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>