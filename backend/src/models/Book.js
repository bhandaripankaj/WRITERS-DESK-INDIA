import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    subject: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    categories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }],
    collections: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection'
    }],
    cover: {
      type: String,
      default: null
    },
    isbn: {
      type: String,
      unique: true,
      sparse: true
    },
    publishDate: {
      type: Date,
      default: null
    },
    publisher: {
      type: String,
      default: ''
    },
    pages: {
      type: Number,
      default: 0
    },
    language: {
      type: String,
      default: 'English'
    },
    stock: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'draft'
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Book', bookSchema)
