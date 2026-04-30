import express from "express"
import cors from "cors"
import multer from "multer"
import fs from "fs"
import db from "./db.js"
import userAuthRoutes from "./routes/userAuthRoutes.js"

const app = express()
const PORT = process.env.PORT || 5000
const uploadDir = "uploads"

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://my-vercel-app-two-flax.vercel.app",
      "https://my-vercel-app-git-main-nitinmajumdar526-5997s-projects.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/uploads", express.static(uploadDir))

app.get("/", (req, res) => {
  res.send("Node backend is running ✅")
})

app.use("/api/user", userAuthRoutes)
