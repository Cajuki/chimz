import express from 'express';
import { protect } from '../middleware/auth.js';
const router = express.Router();

const orders = [];

router.post('/', protect, (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: 'No items in order' });
    
    const order = {
      id: Date.now().toString(),
      orderNumber: 'MTX-' + Date.now().toString().slice(-8),
      userId: req.user.id,
      items,
      totalAmount: items.reduce((sum, i) => sum + (i.price * i.quantity || 0), 0),
      status: 'Pending',
      shippingAddress: shippingAddress || {},
      paymentMethod: paymentMethod || 'Invoice',
      paymentStatus: 'Unpaid',
      notes,
      createdAt: new Date()
    };
    orders.push(order);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my', protect, (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.user.id);
  res.json(userOrders);
});

router.get('/:id', protect, (req, res) => {
  const order = orders.find(o => o.id === req.params.id && o.userId === req.user.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

export default router;
