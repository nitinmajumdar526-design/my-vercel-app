import express from "express"
import cors from "cors"
import multer from "multer"
import fs from "fs"
import db from "./db.js"
import userAuthRoutes from "./routes/userAuthRoutes.js"

const app = express()
const PORT = 5000
const uploadDir = "uploads"

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/uploads", express.static(uploadDir))

app.get("/", (req, res) => {
  res.send("Node backend is running ✅")
})


app.use("/api/user", userAuthRoutes)

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
})

const upload = multer({ storage })

// ADMIN LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const [result] = await db.query("SELECT * FROM users WHERE email = ?", [email])

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid email ❌" })
    }

    const user = result[0]

    if (password !== user.password) {
      return res.status(401).json({ message: "Wrong password ❌" })
    }

    res.json({
      message: "Login successful ✅",
      token: "admin-login-token",
    })
  } catch (err) {
    res.status(500).json({ message: "DB error ❌", error: err.message })
  }
})

// USERS
app.get("/api/users", async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM users")
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: "Users fetch error ❌", error: err.message })
  }
})

// PRODUCTS
app.get("/api/products", async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM products")
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: "Products fetch error ❌", error: err.message })
  }
})

app.get("/api/products/:id", async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ])

    if (result.length === 0) {
      return res.status(404).json({ message: "Product not found ❌" })
    }

    res.json(result[0])
  } catch (err) {
    res.status(500).json({ message: "Product fetch error ❌", error: err.message })
  }
})

app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const { title, description, amount } = req.body
    const image = req.file ? req.file.filename : null

    if (!title || !description || !amount || !image) {
      return res.status(400).json({ message: "All fields required ❌" })
    }

    await db.query(
      "INSERT INTO products (title, description, amount, image) VALUES (?, ?, ?, ?)",
      [title, description, amount, image]
    )

    res.json({ message: "Product added ✅" })
  } catch (err) {
    res.status(500).json({ message: "Product insert error ❌", error: err.message })
  }
})

app.put("/api/products/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, description, amount } = req.body
    const image = req.file ? req.file.filename : null

    const sql = image
      ? "UPDATE products SET title = ?, description = ?, amount = ?, image = ? WHERE id = ?"
      : "UPDATE products SET title = ?, description = ?, amount = ? WHERE id = ?"

    const values = image
      ? [title, description, amount, image, req.params.id]
      : [title, description, amount, req.params.id]

    await db.query(sql, values)

    res.json({ message: "Product updated ✅" })
  } catch (err) {
    res.status(500).json({ message: "Product update error ❌", error: err.message })
  }
})

// CART
app.post("/api/cart", async (req, res) => {
  try {
    console.log("BODY:", req.body)

    const { customerId, productId, customer_id, product_id, quantity } = req.body

    const finalCustomerId = parseInt(customerId ?? customer_id)
    const finalProductId = parseInt(productId ?? product_id)
    const finalQuantity = parseInt(quantity) || 1

    console.log("FINAL:", {
      finalCustomerId,
      finalProductId,
      finalQuantity,
    })

    if (!finalCustomerId || !finalProductId) {
      return res.status(400).json({
        message: "Customer and product required ❌",
        debug: { finalCustomerId, finalProductId },
      })
    }

    const [[user]] = await db.query("SELECT id FROM customers WHERE id = ?", [
  finalCustomerId,
])

    const [[product]] = await db.query("SELECT id FROM products WHERE id = ?", [
      finalProductId,
    ])

    if (!user || !product) {
      return res.status(400).json({
        message: "Invalid customer or product ❌",
      })
    }

    const [existing] = await db.query(
      "SELECT * FROM cart WHERE customer_id = ? AND product_id = ?",
      [finalCustomerId, finalProductId]
    )

    if (existing.length > 0) {
      await db.query(
        "UPDATE cart SET quantity = quantity + ? WHERE customer_id = ? AND product_id = ?",
        [finalQuantity, finalCustomerId, finalProductId]
      )
    } else {
      await db.query(
        "INSERT INTO cart (customer_id, product_id, quantity) VALUES (?, ?, ?)",
        [finalCustomerId, finalProductId, finalQuantity]
      )
    }

    res.json({ message: "Product added to cart ✅" })
  } catch (err) {
    console.error("CART ERROR:", err)
    res.status(500).json({ message: "Cart add error ❌", error: err.message })
  }
})

app.get("/api/cart/:customer_id", async (req, res) => {
  try {
    const customerId = parseInt(req.params.customer_id)

    if (!customerId) {
      return res.status(400).json({ message: "Customer required ❌" })
    }

    const [result] = await db.query(
      `SELECT 
        cart.id,
        cart.customer_id,
        cart.product_id,
        cart.quantity,
        products.title,
        products.amount,
        products.image
      FROM cart
      JOIN products ON cart.product_id = products.id
      WHERE cart.customer_id = ?`,
      [customerId]
    )

    res.json(result)
  } catch (err) {
    res.status(500).json({ message: "Cart fetch error ❌", error: err.message })
  }
})

app.put("/api/cart/:id", async (req, res) => {
  try {
    const cartId = parseInt(req.params.id)
    const quantity = parseInt(req.body.quantity)

    if (!cartId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Valid quantity required ❌" })
    }

    await db.query("UPDATE cart SET quantity = ? WHERE id = ?", [
      quantity,
      cartId,
    ])

    res.json({ message: "Cart quantity updated ✅" })
  } catch (err) {
    res.status(500).json({ message: "Cart update error ❌", error: err.message })
  }
})

app.delete("/api/cart/:id", async (req, res) => {
  try {
    const cartId = parseInt(req.params.id)

    if (!cartId) {
      return res.status(400).json({ message: "Cart id required ❌" })
    }

    await db.query("DELETE FROM cart WHERE id = ?", [cartId])

    res.json({ message: "Cart item removed ✅" })
  } catch (err) {
    res.status(500).json({ message: "Cart remove error ❌", error: err.message })
  }
})

// ORDERS
app.post("/api/orders", async (req, res) => {
  try {
    const { customer_id, customerId } = req.body
    const finalCustomerId = parseInt(customerId ?? customer_id)

    if (!finalCustomerId) {
      return res.status(400).json({ message: "Customer required ❌" })
    }

    const [cartItems] = await db.query(
      `SELECT 
        cart.product_id,
        cart.quantity,
        products.amount
      FROM cart
      JOIN products ON cart.product_id = products.id
      WHERE cart.customer_id = ?`,
      [finalCustomerId]
    )

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty ❌" })
    }

    const total = cartItems.reduce((sum, item) => {
      return sum + Number(item.amount) * Number(item.quantity)
    }, 0)

    const [orderResult] = await db.query(
      "INSERT INTO orders (customer_id, total_amount, status) VALUES (?, ?, ?)",
      [finalCustomerId, total, "pending"]
    )

    const orderId = orderResult.insertId

    for (const item of cartItems) {
      await db.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.product_id, item.quantity, item.amount]
      )
    }

    await db.query("DELETE FROM cart WHERE customer_id = ?", [finalCustomerId])

    res.json({
      message: "Order placed successfully ✅",
      order_id: orderId,
      total_amount: total,
    })
  } catch (err) {
    res.status(500).json({ message: "Order place error ❌", error: err.message })
  }
})

app.get("/api/orders/:customer_id", async (req, res) => {
  try {
    const customerId = parseInt(req.params.customer_id)

    const [orders] = await db.query(
      "SELECT * FROM orders WHERE customer_id = ? ORDER BY id DESC",
      [customerId]
    )

    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: "Orders fetch error ❌", error: err.message })
  }
})

app.get("/api/order-items/:order_id", async (req, res) => {
  try {
    const orderId = parseInt(req.params.order_id)

    const [items] = await db.query(
      `SELECT 
        order_items.id,
        order_items.order_id,
        order_items.product_id,
        order_items.quantity,
        order_items.price,
        products.title,
        products.image
      FROM order_items
      JOIN products ON order_items.product_id = products.id
      WHERE order_items.order_id = ?`,
      [orderId]
    )

    res.json(items)
  } catch (err) {
    res.status(500).json({ message: "Order items fetch error ❌", error: err.message })
  }
})

// GALLERY
app.get("/api/gallery", async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM gallery")

    const data = result.map((item) => ({
      ...item,
      images: JSON.parse(item.images || "[]"),
    }))

    res.json(data)
  } catch (err) {
    res.status(500).json({ message: "Gallery fetch error ❌", error: err.message })
  }
})

app.get("/api/gallery/:id", async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM gallery WHERE id = ?", [
      req.params.id,
    ])

    if (result.length === 0) {
      return res.status(404).json({ message: "Gallery not found ❌" })
    }

    res.json({
      ...result[0],
      images: JSON.parse(result[0].images || "[]"),
    })
  } catch (err) {
    res.status(500).json({ message: "Gallery fetch error ❌", error: err.message })
  }
})

app.post("/api/gallery", upload.array("images", 10), async (req, res) => {
  try {
    const { title } = req.body
    const images = req.files ? req.files.map((file) => file.filename) : []

    if (!title || images.length === 0) {
      return res.status(400).json({ message: "Title and images required ❌" })
    }

    await db.query("INSERT INTO gallery (title, images) VALUES (?, ?)", [
      title,
      JSON.stringify(images),
    ])

    res.json({ message: "Gallery added ✅" })
  } catch (err) {
    res.status(500).json({ message: "Gallery insert error ❌", error: err.message })
  }
})

app.put("/api/gallery/:id", upload.array("images", 10), async (req, res) => {
  try {
    const { title } = req.body
    const images = req.files ? req.files.map((file) => file.filename) : []

    const sql =
      images.length > 0
        ? "UPDATE gallery SET title = ?, images = ? WHERE id = ?"
        : "UPDATE gallery SET title = ? WHERE id = ?"

    const values =
      images.length > 0
        ? [title, JSON.stringify(images), req.params.id]
        : [title, req.params.id]

    await db.query(sql, values)

    res.json({ message: "Gallery updated ✅" })
  } catch (err) {
    res.status(500).json({ message: "Gallery update error ❌", error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})