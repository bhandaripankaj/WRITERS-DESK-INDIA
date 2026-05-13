import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads'
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    const name = path.basename(file.originalname, ext)
    cb(null, name + '-' + uniqueSuffix + ext)
  }
})

// File filter for images
const fileFilter = (req, file, cb) => {
    console.log('Received file:', file.originalname, 'with MIME type:', file.mimetype)
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp',"image/svg+xml"]
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed (jpeg, png, gif, webp)'), false)
  }
}

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

export default upload
