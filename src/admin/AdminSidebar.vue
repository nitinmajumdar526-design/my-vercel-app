<template>
  <aside class="sidebar">
    <h2>Dashboard</h2>

    <!-- ✅ exact match for Home -->
    <router-link 
      to="/admin" 
      exact-active-class="active-link"
    >
      Home
    </router-link>

    <router-link 
      to="/admin/products" 
      active-class="active-link"
    >
      Products
    </router-link>

    <router-link 
      to="/admin/add-product" 
      active-class="active-link"
    >
      Add Product
    </router-link>

    <router-link 
      to="/admin/gallery" 
      active-class="active-link"
    >
      Gallery
    </router-link>

    <router-link 
      to="/admin/add-gallery" 
      active-class="active-link"
    >
      Add Gallery
    </router-link>

    <router-link 
      to="/admin/users" 
      active-class="active-link"
    >
      Users
    </router-link>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 240px;
  background: #111827;
  color: white;
  padding: 25px 18px;
}

.sidebar h2 {
  margin-bottom: 30px;
}

a {
  display: block;
  color: white;
  text-decoration: none;
  padding: 12px 14px;
  border-radius: 8px;
  margin-bottom: 10px;
}

/* ❌ remove this */
/* a.router-link-active { background: #2563eb; } */

/* ✅ use custom class */
a.active-link {
  background: #2563eb;
}
</style>