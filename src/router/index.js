import { createRouter, createWebHistory } from "vue-router"

import Home           from "../views/Home.vue"
import Shop           from "../views/Shop.vue"
import About          from "../views/About.vue"
import Contact        from "../views/Contact.vue"
import Cart           from "../views/Cart.vue"
import Login          from "../views/Login.vue"
import AddAddress     from "../views/AddAddress.vue"
import Checkout       from "../views/Checkout.vue"

import AdminLogin     from "../admin/pages/AdminLogin.vue"
import AdminLayout    from "../admin/AdminLayout.vue"
import Dashboard      from "../admin/pages/Dashboard.vue"
import Products       from "../admin/pages/Products.vue"
import AddProduct     from "../admin/pages/AddProduct.vue"
import EditProduct    from "../admin/pages/EditProduct.vue"
import ProductDetails from "../admin/pages/ProductDetails.vue"
import Users          from "../admin/pages/Users.vue"
import Gallery        from "../admin/pages/Gallery.vue"
import AddGallery     from "../admin/pages/AddGallery.vue"
import GalleryDetails from "../admin/pages/GalleryDetails.vue"
import EditGallery    from "../admin/pages/EditGallery.vue"

// ✅ Customer session check helper
const isCustomerLoggedIn = () => {
  const raw = localStorage.getItem("customer")
  if (!raw) return false
  try {
    const session = JSON.parse(raw)
    return session.expiresAt && Date.now() < session.expiresAt
  } catch {
    return false
  }
}

const routes = [
  { path: "/",            component: Home    },
  { path: "/shop",        component: Shop    },
  { path: "/about",       component: About   },
  { path: "/contact",     component: Contact },
  { path: "/login",       component: Login   },

  // ✅ Protected routes — sirf logged in customer
  { path: "/cart",        component: Cart,       meta: { requiresAuth: true } },
  { path: "/checkout",    component: Checkout,   meta: { requiresAuth: true } },
  { path: "/add-address", component: AddAddress, meta: { requiresAuth: true } },

  // ── Admin ──
  { path: "/admin/login", component: AdminLogin },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAdminAuth: true },
    children: [
      { path: "",                  redirect: "/admin/dashboard" },
      { path: "dashboard",         component: Dashboard      },
      { path: "products",          component: Products       },
      { path: "products/:id",      component: ProductDetails },
      { path: "products/edit/:id", component: EditProduct    },
      { path: "add-product",       component: AddProduct     },
      { path: "gallery",           component: Gallery        },
      { path: "add-gallery",       component: AddGallery     },
      { path: "gallery/:id",       component: GalleryDetails },
      { path: "gallery/edit/:id",  component: EditGallery    },
      { path: "users",             component: Users          },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdminAuth && !localStorage.getItem("adminToken")) {
    return next("/admin/login")
  }
  if (to.meta.requiresAuth && !isCustomerLoggedIn()) {
    return next("/login")
  }
  next()
})

export default router