import express from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../Controllers/userController.js';
import { authMiddleware, authorizeRoles } from '../Middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/create', createUser); // Create a new user

// Protected routes (authentication required)
router.get('/get', authMiddleware, getUsers); // Get all users
router.get('/:id', authMiddleware, getUserById); // Get a user by ID
router.put('/:id', authMiddleware, updateUser); // Update a user by ID
router.delete('/:id', authMiddleware, authorizeRoles(['admin']), deleteUser); // Delete a user by ID (admin only)

export default router;