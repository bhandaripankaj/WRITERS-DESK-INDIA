import mongoose from 'mongoose'

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/writers-desk-india'

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI)
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  }
}
