import express from 'express'
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js'
import { authenticateToken } from '../middleware/auth.js'
import upload from '../config/multer.js'

const router = express.Router()

// Public routes
router.get('/', getAllCategories)
router.get('/:id', getCategoryById)

// Protected routes
router.post('/', upload.single('image'), createCategory)
router.put('/:id', upload.single('image'), updateCategory)
router.delete('/:id', deleteCategory)

export default router