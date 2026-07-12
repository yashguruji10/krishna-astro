import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    serviceTitle: { type: String }, // snapshot of title (in the language the user used)
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    whatsapp: { type: String },
    dob: { type: String }, // date of birth, optional, useful for jyotish
    birthTime: { type: String },
    birthPlace: { type: String },
    message: { type: String },
    locale: { type: String, default: 'en' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'in_progress', 'completed', 'cancelled'],
      default: 'new'
    },
    emailSent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
