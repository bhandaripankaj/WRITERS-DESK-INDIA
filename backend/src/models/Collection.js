import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    showHome: {
        type: Boolean,
        default: false,
    },
    ranking: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true
});

// Generate slug before save
collectionSchema.pre('save', function (next) {

    if (this.name) {

        this.slug = this.name
            .trim()                  // remove extra spaces start/end
            .toLowerCase()          // lowercase
            .replace(/\s+/g, '-')   // spaces -> -
            .replace(/[^\w-]/g, '') // remove special chars
    }

    next();
});
export default mongoose.model('Collection', collectionSchema);