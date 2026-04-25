import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: String,
  county: String,
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: String,
    quantity: Number,
    notes: String
  }],
  message: String,
  status: { type: String, enum: ['New', 'Reviewed', 'Quoted', 'Accepted', 'Declined'], default: 'New' },
  quotedPrice: Number,
  adminNotes: String,
  quoteNumber: String,
  createdAt: { type: Date, default: Date.now }
});

quoteSchema.pre('save', function(next) {
  if (!this.quoteNumber) {
    this.quoteNumber = 'QT-' + Date.now().toString().slice(-8);
  }
  next();
});

export default mongoose.model('Quote', quoteSchema);
