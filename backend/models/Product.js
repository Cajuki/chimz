import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  category: {
    type: String,
    enum: ['Diagnostic Equipment', 'Laboratory Equipment', 'Surgical Instruments', 'Patient Monitoring', 'Imaging Equipment', 'Consumables & Supplies', 'Rehabilitation Equipment', 'Dental Equipment'],
    required: true
  },
  price: { type: Number },
  priceOnRequest: { type: Boolean, default: false },
  images: [String],
  specifications: [{ key: String, value: String }],
  brand: { type: String },
  origin: { type: String },
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', productSchema);
