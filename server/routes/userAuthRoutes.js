import express from "express"
import db from "../db.js"

const router = express.Router()

// EMAIL LOGIN
router.post("/email-login", async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    const [result] = await db.query(
      "SELECT * FROM customers WHERE email = ?",
      [email]
    )

    if (result.length > 0) {
      return res.json({
        message: "Login successful",
        user: result[0],
      })
    }

    const [insertResult] = await db.query(
      "INSERT INTO customers (email) VALUES (?)",
      [email]
    )

    return res.json({
      message: "Customer created",
      user: {
        id: insertResult.insertId,
        email,
      },
    })
  } catch (err) {
    console.error("Email login error:", err)
    return res.status(500).json({
      message: "Email login server error",
      error: err.message,
    })
  }
})

// GOOGLE LOGIN
router.post("/google-login", async (req, res) => {
  try {
    const { name, email, google_id, image } = req.body

    if (!email || !google_id) {
      return res.status(400).json({
        message: "Google login data missing",
      })
    }

    const [result] = await db.query(
      "SELECT * FROM customers WHERE email = ? OR google_id = ?",
      [email, google_id]
    )

    if (result.length > 0) {
      const customer = result[0]

      await db.query(
        "UPDATE customers SET name = ?, google_id = ?, image = ? WHERE id = ?",
        [name, google_id, image, customer.id]
      )

      return res.json({
        message: "Google login successful",
        user: {
          ...customer,
          name,
          email,
          google_id,
          image,
        },
      })
    }

    const [insertResult] = await db.query(
      "INSERT INTO customers (name, email, google_id, image) VALUES (?, ?, ?, ?)",
      [name, email, google_id, image]
    )

    return res.json({
      message: "Customer created with Google",
      user: {
        id: insertResult.insertId,
        name,
        email,
        google_id,
        image,
      },
    })
  } catch (err) {
    console.error("Google login error:", err)
    return res.status(500).json({
      message: "Google login server error",
      error: err.message,
    })
  }
})

export default router