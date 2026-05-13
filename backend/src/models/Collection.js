import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Collection', collectionSchema);