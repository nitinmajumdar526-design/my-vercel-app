import express from 'express'
import db from '../db.js'

const router = express.Router()

// SIGNUP
router.post('/signup', (req, res) => {
  const { name, email, password } = req.body

  db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: 'User already exists or DB error ❌'
        })
      }

      res.json({
        message: 'Signup successful ✅'
      })
    }
  )
})

// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body

  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: 'DB error ❌'
        })
      }

      if (result.length === 0) {
        return res.status(401).json({
          message: 'Invalid email ❌'
        })
      }

      const user = result[0]

      if (password !== user.password) {
        return res.status(401).json({
          message: 'Wrong password ❌'
        })
      }

      res.json({
        message: 'Login successful ✅',
        token: 'admin-login-token'
      })
    }
  )
})

export default router