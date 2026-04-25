import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String },
  company: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  address: {
    street: String, city: String, county: String, country: { type: String, default: 'Kenya' }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
