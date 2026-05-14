import express from 'express'
import { getAllCollections, getCollectionById, createCollection, updateCollection, deleteCollection } from '../controllers/collectionController.js'
import { authenticateToken } from '../middleware/auth.js'
import upload from '../config/multer.js'

const router = express.Router()

// Public routes
router.get('/', getAllCollections)
router.get('/:id', getCollectionById)

// Protected routes
router.post('/', authenticateToken, createCollection)
router.put('/:id', authenticateToken, updateCollection)
router.delete('/:id', authenticateToken, deleteCollection)

export default router