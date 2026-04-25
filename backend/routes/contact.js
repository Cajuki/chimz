import express from 'express';
const router = express.Router();

const messages = [];

router.post('/', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ message: 'Name, email, and message required' });
    
    const contact = { id: Date.now().toString(), name, email, phone, subject, message, read: false, createdAt: new Date() };
    messages.push(contact);
    res.status(201).json({ message: 'Message received. Our team will contact you within 24 hours.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
