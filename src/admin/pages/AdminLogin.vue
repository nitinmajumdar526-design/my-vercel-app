<template>
  <div>
    <h1>Admin Login</h1>

    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />

    <button @click="login">Login</button>

    <p style="color:red">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const API_URL = import.meta.env.VITE_API_URL

const email = ref("")
const password = ref("")
const error = ref("")

const login = async () => {
  try {
    error.value = ""

    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      error.value = data.message || "Login failed"
      return
    }

    localStorage.setItem("adminToken", data.token)
    router.push("/admin/dashboard")
  } catch (err) {
    error.value = "Server error"
    console.error(err)
  }
}
</script>