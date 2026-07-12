import mongoose from 'mongoose';

const TranslatedString = {
  en: { type: String, default: '' },
  hi: { type: String, default: '' },
  gu: { type: String, default: '' }
};

const ServiceSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: TranslatedString,
    shortDescription: TranslatedString,
    description: TranslatedString, // can contain HTML
    image: { type: String, default: '' }, // path under /uploads or external URL
    price: { type: Number, default: 0 }, // 0 means "price on request"
    category: {
      type: String,
      enum: ['service', 'product'],
      default: 'service'
    },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
