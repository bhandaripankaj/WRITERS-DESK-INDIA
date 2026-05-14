import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
      slug: {
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
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: false,
      min: 0
    },
    categories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    }],
    collections: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
      required: true
    }],
    cover: {
      type: String,
      required: true
    },
    identificationNumber: {
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
bookSchema.pre('save', function (next) {

    if (this.title) {

        this.slug = this.title
            .trim()                  // remove extra spaces start/end
            .toLowerCase()          // lowercase
            .replace(/\s+/g, '-')   // spaces -> -
            .replace(/[^\w-]/g, '') // remove special chars
    }

    next();
});
export default mongoose.model('Book', bookSchema)
