import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, unique: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: { type: Number, required: true },
    price: Number
  }],
  totalAmount: { type: Number },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  shippingAddress: {
    street: String, city: String, county: String, country: { type: String, default: 'Kenya' }
  },
  paymentMethod: { type: String, enum: ['M-Pesa', 'Bank Transfer', 'Credit Card', 'Invoice'], default: 'Invoice' },
  paymentStatus: { type: String, enum: ['Unpaid', 'Paid', 'Partial'], default: 'Unpaid' },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = 'MTX-' + Date.now().toString().slice(-8);
  }
  next();
});

export default mongoose.model('Order', orderSchema);
