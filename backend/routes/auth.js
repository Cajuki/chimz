import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'medithrex_secret_2024';

// Demo users (replace with DB in production)
const demoUsers = [];

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, company, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Required fields missing' });
    
    const exists = demoUsers.find(u => u.email === email);
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = { id: Date.now().toString(), name, email, phone, company, password: hashed, role: 'user', createdAt: new Date() };
    demoUsers.push(user);

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, name, email, phone, company, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = demoUsers.find(u => u.email === email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, company: user.company, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get profile
router.get('/profile', protect, (req, res) => {
  const user = demoUsers.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { password, ...safe } = user;
  res.json(safe);
});

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const idx = demoUsers.findIndex(u => u.id === req.user.id);
    if (idx === -1) return res.status(404).json({ message: 'User not found' });
    const { password, role, ...updates } = req.body;
    demoUsers[idx] = { ...demoUsers[idx], ...updates };
    const { password: pw, ...safe } = demoUsers[idx];
    res.json(safe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
