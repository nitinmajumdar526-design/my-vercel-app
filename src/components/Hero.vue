<script setup>
import shoes from '../assets/shoes.png'
</script>

<template>
  <section class="hero">
    <div class="container">
      <div class="content">
        <p>Welcome to this landing page</p>
        <h1>Hello Users 👋</h1>
        <button>Get Started</button>
      </div>

      <div class="image">
        <img :src="shoes" alt="shoes" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 80px 20px;
  background: linear-gradient(90deg, #1b1b1c 0%, #4c4c59 35%, #414b4d 100%);
}

.container {
  max-width: 1100px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.content h1 {
  font-size: 48px;
  color: white;
}

button {
  padding: 12px 24px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
}

.image img {
  width: 350px;
  animation: shoeMove 3s ease-in-out infinite alternate;
}

@keyframes shoeMove {
  from {
    transform: translateX(-15px);
  }

  to {
    transform: translateX(15px);
  }
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}
</style>