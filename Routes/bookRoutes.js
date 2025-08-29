import express from 'express';
import {createBook, getBooks, getBookById, updateBook, deleteBook} from '../Controllers/bookController.js';
import { authMiddleware, authorizeRoles } from '../Middlewares/authMiddleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/get', getBooks); // Get all books
router.get('/:id', getBookById); // Get a book by ID

// Protected routes (authentication required)
router.post('/create', authMiddleware, authorizeRoles(['admin', 'librarian']), createBook); // Create a new book
router.put('/:id', authMiddleware, authorizeRoles(['admin', 'librarian']), updateBook); // Update a book by ID
router.delete('/:id', authMiddleware, authorizeRoles(['admin', 'librarian']), deleteBook); // Delete a book by ID

export default router;

