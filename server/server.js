import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRoutes      from './routes/authRoutes.js'
import sessionRoutes   from './routes/sessionRoutes.js'

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 5000

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000', credentials: true }))
app.use(express.json({ limit: '10mb' }))

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes)
app.use('/api/sessions', sessionRoutes)

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }))

// ── DB + Start ───────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message)
    process.exit(1)
  })

export default app
