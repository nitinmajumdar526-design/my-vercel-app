<script setup>
import { ref } from 'vue'

const title = ref('')
const description = ref('')
const image = ref('')
const message = ref('')

const addProduct = async () => {
  const res = await fetch('http://localhost:5000/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: title.value,
      description: description.value,
      image: image.value
    })
  })

  const data = await res.json()
  message.value = data.message

  title.value = ''
  description.value = ''
  image.value = ''
}
</script>

<template>
  <div class="admin">
    <h1>Admin Panel</h1>

    <form @submit.prevent="addProduct">
      <input v-model="title" type="text" placeholder="Product title" required />

      <textarea
        v-model="description"
        placeholder="Product description"
        required
      ></textarea>

      <input v-model="image" type="text" placeholder="Image name e.g. image1.png" required />

      <button type="submit">Add Product</button>
    </form>

    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
.admin {
  max-width: 500px;
  margin: 80px auto;
  padding: 30px;
  background: white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border-radius: 16px;
}

input,
textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

textarea {
  height: 100px;
}

button {
  width: 100%;
  padding: 12px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
}
</style>