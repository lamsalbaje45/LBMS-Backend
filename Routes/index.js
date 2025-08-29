import express from 'express';
import book from './bookRoutes.js';
import user from './userRoutes.js';
import auth from './authRoutes.js';
import borrow from './borrowRoutes.js';

const router = express.Router();

// Routes
router.use('/book', book); // Import book routes
router.use('/user', user); // Import user routes
router.use('/auth', auth); // Import auth routes
router.use('/borrow', borrow); // Import borrow routes



export default router;