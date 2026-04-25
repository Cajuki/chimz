import express from 'express';
import { protect } from '../middleware/auth.js';
const router = express.Router();

const quotes = [];

router.post('/', (req, res) => {
  try {
    const { name, email, phone, company, county, items, message } = req.body;
    if (!name || !email || !phone) return res.status(400).json({ message: 'Name, email, and phone required' });
    
    const quote = {
      id: Date.now().toString(),
      quoteNumber: 'QT-' + Date.now().toString().slice(-8),
      name, email, phone, company, county,
      items: items || [],
      message,
      status: 'New',
      createdAt: new Date()
    };
    quotes.push(quote);
    res.status(201).json({ message: 'Quote request submitted successfully', quoteNumber: quote.quoteNumber });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my', protect, (req, res) => {
  const userQuotes = quotes.filter(q => q.email === req.user.email);
  res.json(userQuotes);
});

export default router;
