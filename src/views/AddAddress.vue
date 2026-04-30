<template>
  <div class="page">
    <div class="card">
      <button class="back-btn" @click="$router.back()">← Back</button>
      <h2>Add Address</h2>

      <input    v-model="form.name"  placeholder="Full Name"    class="inp" />
      <input    v-model="form.phone" placeholder="Phone Number" class="inp" />
      <input    v-model="form.city"  placeholder="City"         class="inp" />
      <textarea v-model="form.full"  placeholder="Full Address" class="inp textarea" />

      <button @click="saveAddress" :disabled="saving" class="save-btn">
        {{ saving ? "Saving..." : "Save Address" }}
      </button>
    </div>
  </div>
</template>

<script>
const API_URL = "http://localhost:5000/api/user"

export default {
  data() {
    return {
      form:   { name: "", phone: "", city: "", full: "" },
      saving: false,
    }
  },

  methods: {
    getUser() {
      const raw = localStorage.getItem("customer")
      if (!raw) return null
      try {
        const session = JSON.parse(raw)
        return session.expiresAt && Date.now() < session.expiresAt
          ? session.user
          : null
      } catch { return null }
    },

    async saveAddress() {
      const { name, phone, city, full } = this.form
      if (!name || !phone || !city || !full) {
        alert("Sab fields bharein")
        return
      }

      const user = this.getUser()
      if (!user) {
        alert("Session expire ho gayi, dobara login karein")
        this.$router.push("/login")
        return
      }

      this.saving = true
      try {
        const res = await fetch(`${API_URL}/save-address`, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id:   user.id,
            full_name: name,
            phone,
            city,
            address:   full,
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          alert(data.message || "Address save nahi hua")
          return
        }

        this.$router.push("/checkout")

      } catch (err) {
        alert("Error: " + err.message)
      } finally {
        this.saving = false
      }
    },
  },
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #111;
}

.card {
  width: 420px;
  padding: 36px;
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 24px;
}

.back-btn {
  background: none;
  border: none;
  color: #aaa;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 16px;
  padding: 0;
}

.back-btn:hover { color: #fff; }

h2 {
  color: white;
  margin: 0 0 24px;
  text-align: center;
  font-size: 22px;
}

.inp {
  width: 100%;
  box-sizing: border-box;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 10px;
  color: #fff;
  padding: 12px 16px;
  font-size: 15px;
  margin-bottom: 12px;
  display: block;
}

.inp::placeholder { color: #666; }
.inp:focus        { outline: none; border-color: #666; }

.textarea {
  height: 90px;
  resize: vertical;
}

.save-btn {
  width: 100%;
  height: 50px;
  background: #f7f5f0;
  color: #1a1a1a;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 4px;
  transition: opacity 0.2s;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>