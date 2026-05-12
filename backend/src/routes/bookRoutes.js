import express from 'express'
import { getAllBooks, getBookById, createBook, updateBook, deleteBook } from '../controllers/bookController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.get('/', getAllBooks)
router.get('/:id', getBookById)

// Protected routes
router.post('/', authenticateToken, createBook)
router.put('/:id', authenticateToken, updateBook)
router.delete('/:id', authenticateToken, deleteBook)

export default router
