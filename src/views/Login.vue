<template>
  <div class="login-page">
    <div class="login-card">
      <h2 class="title">Login</h2>

      <div id="googleSignInBtn"></div>

      <div class="or">OR</div>

      <input
        v-model="email"
        class="email-input"
        type="email"
        placeholder="Enter your email"
      />

      <button class="email-btn" @click="emailLogin">
        Continue with Email
      </button>
    </div>
  </div>
</template>

<script>
const API_URL = "http://localhost:5000/api/user"
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 din

export default {
  data() {
    return {
      email: "",
      googleInitialized: false,
    }
  },

  mounted() {
    if (this.isSessionValid()) {
      this.$router.push("/")
      return
    }
    this.loadGoogleButton()
  },

  beforeUnmount() {
    const btn = document.getElementById("googleSignInBtn")
    if (btn) btn.innerHTML = ""
  },

  methods: {
    saveSession(user) {
      const session = {
        user,
        expiresAt: Date.now() + SESSION_DURATION,
      }
      localStorage.setItem("customer", JSON.stringify(session))
    },

    isSessionValid() {
      const raw = localStorage.getItem("customer")
      if (!raw) return false
      try {
        const session = JSON.parse(raw)
        if (!session.expiresAt || Date.now() > session.expiresAt) {
          localStorage.removeItem("customer")
          return false
        }
        return true
      } catch {
        localStorage.removeItem("customer")
        return false
      }
    },

    loadGoogleButton() {
      const timer = setInterval(() => {
        if (window.google?.accounts?.id && !this.googleInitialized) {
          clearInterval(timer)
          this.googleInitialized = true

          window.google.accounts.id.initialize({
            client_id: "566971903390-1c0662n1bc3f6f3ur4t010a11se19ee3.apps.googleusercontent.com",
            callback: this.handleGoogleLogin,
          })

          const btn = document.getElementById("googleSignInBtn")
          if (btn) {
            btn.innerHTML = ""
            window.google.accounts.id.renderButton(btn, {
              theme: "outline",
              size: "large",
              text: "continue_with",
              width: 350,
            })
          }
        }
      }, 300)
      setTimeout(() => clearInterval(timer), 10000)
    },

    decodeJwt(token) {
      const base64Url = token.split(".")[1]
      const base64    = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      return JSON.parse(
        decodeURIComponent(
          atob(base64).split("").map((c) =>
            "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
          ).join("")
        )
      )
    },

    async readJsonResponse(res) {
      const text = await res.text()
      try {
        return JSON.parse(text)
      } catch {
        throw new Error("Backend route not found ya server HTML response de raha hai")
      }
    },

    async handleGoogleLogin(response) {
      try {
        if (!response.credential) {
          alert("Google credential missing")
          return
        }
        const user = this.decodeJwt(response.credential)
        const res  = await fetch(`${API_URL}/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name:      user.name,
            email:     user.email,
            google_id: user.sub,
            image:     user.picture,
          }),
        })
        const data = await this.readJsonResponse(res)
        if (!res.ok || !data.user) {
          alert(data.message + "\n" + (data.error || data.sqlMessage || ""))
          return
        }
        this.saveSession(data.user)
        this.$router.push("/")
      } catch (err) {
        alert(err.message || "Google login failed")
      }
    },

    async emailLogin() {
      if (!this.email.trim()) {
        alert("Please enter email")
        return
      }
      try {
        const res  = await fetch(`${API_URL}/email-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email.trim() }),
        })
        const data = await this.readJsonResponse(res)
        if (!res.ok || !data.user) {
          alert(data.message || data.error?.sqlMessage || "Email login failed")
          return
        }
        this.saveSession(data.user)
        this.$router.push("/")
      } catch (err) {
        alert(err.message || "Email login failed")
      }
    },
  },
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #111;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 420px;
  padding: 36px;
  border: 1px solid #333;
  border-radius: 28px;
  background: #111;
}

.title {
  color: white;
  text-align: center;
  margin-bottom: 20px;
}

#googleSignInBtn {
  display: flex;
  justify-content: center;
}

.or {
  text-align: center;
  color: #aaa;
  margin: 18px 0;
}

.email-input {
  width: 100%;
  height: 54px;
  box-sizing: border-box;
  border-radius: 12px;
  border: 1px solid #555;
  background: #2a2a2a;
  color: #fff;
  padding: 0 16px;
  font-size: 16px;
}

.email-btn {
  width: 100%;
  height: 54px;
  margin-top: 16px;
  border: none;
  border-radius: 12px;
  background: #f7f5f0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
</style>