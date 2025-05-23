// routes/Admin.js

import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

const isAdminMiddleware = (req, res, next) => {
  console.log('Middleware req.user:', req.user); 
  console.log('AdminRoutes isAdmin:', req.user ? req.user.isAdmin : 'No user found'); 
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admins only!' });
  }
  next();
};

router.get('/dashboard', auth, isAdminMiddleware, async (req, res) => {
  try {
    console.log('AdminRoutes Dashboard Accessed by:', req.user); 
    const usersCount = await User.countDocuments();
    res.status(200).json({
      message: 'Welcome to the admin dashboard!',
      usersCount,
    });
  } catch (error) {
    console.error('Error fetching admin data:', error.message); 
    res.status(500).json({ message: 'Error fetching admin data', error: error.message });
  }
});

router.get('/users', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const users = await User.find().select(
      'userId first_name last_name email isVerified isSeller country province cityOrTown barangay bio'
    );

    if (!users.length) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

router.get('/verify', auth, isAdminMiddleware, (req, res) => {
  res.status(200).json({
    message: 'Admin verified',
    isAdmin: true, 
  });
});

export default router;
