<script setup>
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()

const features = [
  {
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
    </svg>`,
    label: 'Best Quality',
    desc:  'Every shoe is crafted with premium materials for long-lasting comfort and style.'
  },
  {
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3M9 17h6m4 0h2m-6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
        stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    label: 'Fast Delivery',
    desc:  'Get your order delivered within 2–3 business days anywhere in India.'
  },
  {
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
        stroke="currentColor" stroke-width="1.6"/>
      <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="1.6"
        stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    label: 'Best Price',
    desc:  'We offer competitive pricing without compromising on quality.'
  },
  {
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"
        stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"
        stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M3 21v-5h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
    </svg>`,
    label: 'Easy Returns',
    desc:  'Not happy? Return within 7 days — no questions asked.'
  },
]

const stats = [
  { value: '50K+',  label: 'Happy Customers' },
  { value: '200+',  label: 'Shoe Styles'      },
  { value: '4.9★',  label: 'Average Rating'   },
  { value: '2020',  label: 'Founded'           },
]
</script>

<template>
  <div>
    <Navbar />

    <div class="about">

      <!-- ── Hero ── -->
      <div class="hero-about">
        <button class="back-btn" @click="router.back()">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.8"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back
        </button>

        <span class="hero-tag">Est. 2020</span>
        <h1 class="hero-title">About ShoeStore</h1>
        <p class="hero-sub">We bring the best footwear to your doorstep.</p>
      </div>

      <!-- ── Stats Strip ── -->
      <div class="stats-strip">
        <div class="stats-inner">
          <div class="stat-item" v-for="s in stats" :key="s.label">
            <span class="stat-value">{{ s.value }}</span>
            <span class="stat-label">{{ s.label }}</span>
          </div>
        </div>
      </div>

      <!-- ── Features Grid ── -->
      <div class="features-section">
        <div class="features-header">
          <span class="section-tag">Why Us</span>
          <h2 class="features-title">What Makes Us Different</h2>
        </div>

        <div class="features-grid">
          <div class="feature-card" v-for="f in features" :key="f.label">
            <div class="feature-icon" v-html="f.icon"></div>
            <h3 class="feature-title">{{ f.label }}</h3>
            <p  class="feature-desc">{{ f.desc }}</p>
          </div>
        </div>
      </div>

      <!-- ── Mission ── -->
      <div class="mission-section">
        <div class="mission-card">
          <span class="section-tag">Our Mission</span>
          <h2 class="mission-title">Built for Every Step</h2>
          <p class="mission-text">
            At ShoeStore, we believe everyone deserves stylish, comfortable, and affordable
            footwear. Our mission is to make premium shoes accessible to all — from your
            morning run to your evening out.
          </p>
          <button class="shop-btn" @click="router.push('/shop')">
            Explore Collection
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M3 7.5h9M8 3.5l4 4-4 4" stroke="currentColor" stroke-width="1.6"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

    </div>

    <Footer />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@400;500&display=swap');

.about {
  background: #f7f6f2;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
}

/* ── Hero ── */
.hero-about {
  position: relative;
  background: #1a1a1a;
  padding: 72px 24px 80px;
  text-align: center;
  overflow: hidden;
}

/* subtle texture ring */
.hero-about::before {
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

/* ── Stats Strip ── */
.stats-strip {
  background: #fff;
  border-bottom: 1px solid #ece9e1;
}

.stats-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 28px 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 0;
  border-right: 1px solid #ece9e1;
}

.stat-item:last-child { border-right: none; }

.stat-value {
  font-family: 'Syne', sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 12px;
  color: #9c9286;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* ── Features Section ── */
.features-section {
  max-width: 1100px;
  margin: 0 auto;
  padding: 72px 24px 0;
}

.features-header {
  text-align: center;
  margin-bottom: 44px;
}

.section-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #8b7355;
  background: #ede9e0;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 12px;
}

.features-title {
  font-family: 'Syne', sans-serif;
  font-size: 34px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: -0.02em;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 24px;
}

.feature-card {
  background: #fff;
  border: 1px solid #ece9e1;
  border-radius: 20px;
  padding: 32px 28px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 18px 44px rgba(0,0,0,0.08);
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f5f3ef;
  border: 1px solid #ece9e1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
  margin-bottom: 18px;
}

.feature-title {
  font-family: 'Syne', sans-serif;
  font-size: 17px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.feature-desc {
  font-size: 13.5px;
  color: #9c9286;
  line-height: 1.65;
  margin: 0;
}

/* ── Mission ── */
.mission-section {
  max-width: 1100px;
  margin: 0 auto;
  padding: 52px 24px 88px;
}

.mission-card {
  background: #1a1a1a;
  border-radius: 24px;
  padding: 56px 52px;
  text-align: center;
}

.mission-card .section-tag {
  background: rgba(139,115,85,0.2);
  color: #c9a876;
  border: 1px solid rgba(139,115,85,0.25);
}

.mission-title {
  font-family: 'Syne', sans-serif;
  font-size: 34px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 18px;
  letter-spacing: -0.02em;
}

.mission-text {
  font-size: 16px;
  color: #888;
  line-height: 1.85;
  max-width: 580px;
  margin: 0 auto 32px;
}

.shop-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  background: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}

.shop-btn:hover {
  background: #f0ece4;
  transform: scale(1.03);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .hero-title    { font-size: 34px; }
  .stats-inner   { grid-template-columns: repeat(2, 1fr); }
  .stat-item:nth-child(2) { border-right: none; }
  .mission-card  { padding: 36px 24px; }
  .mission-title { font-size: 26px; }
  .back-btn      { position: static; margin: 0 0 28px; }
  .hero-about    { padding: 36px 24px 56px; }
}
</style>