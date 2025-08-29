import express from 'express';
import { createBorrow, getBorrows, getBorrowsByUser, returnBook, createBorrowRequest, getBorrowRequests, approveBorrowRequest, rejectBorrowRequest } from '../Controllers/borrowcontroller.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';

const router = express.Router();

// Create a new borrow record
router.post('/', authMiddleware, createBorrow);

// Get all borrow records (admin/librarian only)
router.get('/', authMiddleware, getBorrows);

// Get borrow records by authenticated user
router.get('/user', authMiddleware, getBorrowsByUser);

// Return a book
router.put('/return/:borrowId', authMiddleware, returnBook);

// Borrow request routes
router.post('/request', authMiddleware, createBorrowRequest);
router.get('/requests', authMiddleware, getBorrowRequests);
router.put('/approve/:requestId', authMiddleware, approveBorrowRequest);
router.put('/reject/:requestId', authMiddleware, rejectBorrowRequest);

export default router;
