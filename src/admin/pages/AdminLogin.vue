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

    const res = await fetch(`${API_URL}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value.trim(),
        password: password.value,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      error.value = data.message || "Login failed"
      return
    }

    localStorage.setItem("adminToken", data.token || "user-login")
    localStorage.setItem("adminUser", JSON.stringify(data.user || data))

    router.push("/admin/dashboard")
  } catch (err) {
    console.error(err)
    error.value = "Server error"
  }
}
</script>
