import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import bookRoutes from './routes/bookRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import collectionRoutes from './routes/collectionRoutes.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static('uploads'))

// Connect to MongoDB
connectDB()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/collections', collectionRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Server error', error: err.message })
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
