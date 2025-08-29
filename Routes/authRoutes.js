import express from 'express';
import { login, register, logout, getProfile, forgotPassword, validateResetToken, resetPassword } from '../Controllers/authController.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', login); // Login route
router.post('/register', register); // Register route

// Protected routes
router.post('/logout', authMiddleware, logout); // Logout route
router.get('/profile', authMiddleware, getProfile); // Get profile route

// Password reset routes
router.post('/forgot-password', forgotPassword); // Forgot password route
router.get('/validate-reset-token/:token', validateResetToken); // Validate reset token route
router.post('/reset-password', resetPassword); // Reset password route

export default router;