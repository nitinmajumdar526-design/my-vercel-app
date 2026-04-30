<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()

const form = ref({ name: '', email: '', message: '' })
const sent  = ref(false)
const error = ref(false)

const submit = () => {
  if (!form.value.name || !form.value.email || !form.value.message) {
    error.value = true
    setTimeout(() => error.value = false, 2500)
    return
  }
  sent.value  = true
  error.value = false
  form.value  = { name: '', email: '', message: '' }
  setTimeout(() => sent.value = false, 3500)
}

const infos = [
  {
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
        stroke="currentColor" stroke-width="1.5"/>
      <path d="M10 2a7 7 0 0 1 7 7c0 4.5-7 11-7 11S3 13.5 3 9a7 7 0 0 1 7-7z"
        stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`,
    label: 'Address',
    value: '123 Shoe Street, Jodhpur, Rajasthan'
  },
  {
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 4h3l1.5 3.5-1.75 1.75A11 11 0 0 0 12.75 14.25L14.5 12.5 18 14v3a1 1 0 0 1-1 1A15 15 0 0 1 2 3a1 1 0 0 1 1-1z"
        stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`,
    label: 'Phone',
    value: '+91 98765 43210'
  },
  {
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="13" rx="2"
        stroke="currentColor" stroke-width="1.5"/>
      <path d="M2 7l8 5 8-5"
        stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    label: 'Email',
    value: 'support@shoestore.com'
  },
  {
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/>
      <path d="M10 6v4l3 2" stroke="currentColor" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    label: 'Working Hours',
    value: 'Mon – Sat: 9am – 6pm'
  },
]
</script>

<template>
  <div>
    <Navbar />

    <div class="contact">

      <!-- ── Hero ── -->
      <div class="hero-contact">
        <button class="back-btn" @click="router.back()">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.8"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back
        </button>
        <span class="hero-tag">Get In Touch</span>
        <h1 class="hero-title">Contact Us</h1>
        <p class="hero-sub">We'd love to hear from you — drop us a message.</p>
      </div>

      <!-- ── Grid ── -->
      <div class="contact-grid">

        <!-- Left: Info Cards -->
        <div class="info-col">
          <div class="info-card" v-for="item in infos" :key="item.label">
            <div class="info-icon" v-html="item.icon"></div>
            <div>
              <p class="info-label">{{ item.label }}</p>
              <p class="info-value">{{ item.value }}</p>
            </div>
          </div>

          <!-- Social strip -->
          <div class="social-strip">
            <p class="social-heading">Follow us</p>
            <div class="social-icons">
              <a href="#" class="social-btn" title="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5"
                    stroke="currentColor" stroke-width="1.6"/>
                  <circle cx="12" cy="12" r="4"
                    stroke="currentColor" stroke-width="1.6"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" class="social-btn" title="Twitter / X">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4l16 16M4 20L20 4" stroke="currentColor"
                    stroke-width="1.6" stroke-linecap="round"/>
                </svg>
              </a>
              <a href="#" class="social-btn" title="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12a9 9 0 1 1-9.5-8.98L21 3l-1.05 9z"
                    stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
                  <path d="M9 10c.5 1.5 2.5 3.5 5 4"
                    stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Right: Form -->
        <div class="form-card">

          <!-- Success State -->
          <transition name="fade">
            <div v-if="sent" class="success-box">
              <div class="success-icon">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="13" stroke="#059669" stroke-width="1.6"/>
                  <path d="M8 14l4 4 8-8" stroke="#059669" stroke-width="1.8"
                    stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3 class="success-title">Message Sent!</h3>
              <p class="success-sub">We'll get back to you within 24 hours.</p>
            </div>
          </transition>

          <!-- Form -->
          <transition name="fade">
            <div v-if="!sent" class="form-inner">
              <h2 class="form-heading">Send a Message</h2>

              <!-- Error Banner -->
              <div v-if="error" class="error-banner">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <circle cx="7.5" cy="7.5" r="6.5" stroke="#dc2626" stroke-width="1.4"/>
                  <path d="M7.5 4.5v3.5M7.5 10h.01"
                    stroke="#dc2626" stroke-width="1.4" stroke-linecap="round"/>
                </svg>
                Please fill in all fields before sending.
              </div>

              <div class="field">
                <label>Your Name</label>
                <input v-model="form.name" type="text" placeholder="e.g. Rahul Sharma" />
              </div>

              <div class="field">
                <label>Email Address</label>
                <input v-model="form.email" type="email" placeholder="you@example.com" />
              </div>

              <div class="field">
                <label>Message</label>
                <textarea
                  v-model="form.message"
                  placeholder="Write your message here..."
                  rows="5"
                />
              </div>

              <button class="submit-btn" @click="submit">
                Send Message
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8h12M9 3l5 5-5 5"
                    stroke="currentColor" stroke-width="1.6"
                    stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </transition>

        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@400;500&display=swap');

.contact {
  background: #f7f6f2;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
}

/* ── Hero ── */
.hero-contact {
  position: relative;
  background: #1a1a1a;
  padding: 72px 24px 80px;
  text-align: center;
  overflow: hidden;
}

.hero-contact::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  border: 80px solid rgba(255,255,255,0.03);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.back-btn {
  position: absolute;
  top: 28px;
  left: 32px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #aaa;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  padding: 7px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, transform 0.15s;
}

.back-btn:hover {
  background: rgba(255,255,255,0.14);
  color: #fff;
  transform: translateX(-2px);
}

.hero-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #8b7355;
  background: rgba(139,115,85,0.15);
  border: 1px solid rgba(139,115,85,0.25);
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 20px;
}

.hero-title {
  font-family: 'Syne', sans-serif;
  font-size: 52px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 14px;
  letter-spacing: -0.03em;
}

.hero-sub {
  font-size: 17px;
  color: #888;
  margin: 0;
}

/* ── Main Grid ── */
.contact-grid {
  max-width: 1100px;
  margin: 0 auto;
  padding: 64px 24px 88px;
  display: grid;
  grid-template-columns: 1fr 1.55fr;
  gap: 32px;
  align-items: start;
}

/* ── Info Column ── */
.info-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-card {
  background: #fff;
  border: 1px solid #ece9e1;
  border-radius: 16px;
  padding: 20px 22px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.info-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.07);
}

.info-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #f5f3ef;
  border: 1px solid #ece9e1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
  flex-shrink: 0;
}

.info-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #9c9286;
  margin: 0 0 4px;
}

.info-value {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.5;
}

/* ── Social Strip ── */
.social-strip {
  background: #1a1a1a;
  border-radius: 16px;
  padding: 22px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.social-heading {
  font-size: 13px;
  font-weight: 500;
  color: #888;
  margin: 0;
  letter-spacing: 0.04em;
}

.social-icons {
  display: flex;
  gap: 10px;
}

.social-btn {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}

.social-btn:hover {
  background: rgba(255,255,255,0.16);
  color: #fff;
}

/* ── Form Card ── */
.form-card {
  background: #fff;
  border: 1px solid #ece9e1;
  border-radius: 24px;
  padding: 40px 40px 44px;
  min-height: 460px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-heading {
  font-family: 'Syne', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 28px;
  letter-spacing: -0.015em;
}

/* ── Error Banner ── */
.error-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 10px;
  margin-bottom: 20px;
}

/* ── Fields ── */
.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 20px;
}

label {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9c9286;
}

input, textarea {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: #1a1a1a;
  background: #faf9f7;
  border: 1px solid #e5e1d8;
  border-radius: 12px;
  padding: 12px 16px;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s, background 0.2s;
}

input::placeholder, textarea::placeholder { color: #c4bfb6; }

input:focus, textarea:focus {
  border-color: #1a1a1a;
  background: #fff;
}

/* ── Submit Button ── */
.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 13px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background: #1a1a1a;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 4px;
  transition: background 0.2s, transform 0.15s;
}

.submit-btn:hover  { background: #333; transform: scale(1.02); }
.submit-btn:active { transform: scale(0.98); }

/* ── Success Box ── */
.success-box {
  text-align: center;
  padding: 40px 20px;
}

.success-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #d1fae5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.success-title {
  font-family: 'Syne', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.success-sub {
  font-size: 14px;
  color: #9c9286;
  margin: 0;
}

/* ── Fade Transition ── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .contact-grid  { grid-template-columns: 1fr; padding: 40px 16px 60px; }
  .hero-title    { font-size: 34px; }
  .back-btn      { position: static; margin: 0 0 28px; }
  .hero-contact  { padding: 36px 24px 56px; }
  .form-card     { padding: 28px 22px 32px; }
}
</style>