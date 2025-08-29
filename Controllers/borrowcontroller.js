import Borrow from "../Models/borrow.js";
import Book from "../Models/book.js";
import User from "../Models/user.js";

// Create a new borrow record
export const createBorrow = async (req, res) => {
    try {
        const { bookId, dueDate } = req.body;
        const userId = req.user._id; // Get user ID from authenticated user

        // Validate required fields
        if (!bookId) {
            return res.status(400).json({ message: "Book ID is required" });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if book exists and has available copies
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.availableCopies <= 0) {
            return res.status(400).json({ message: "No copies available for borrowing" });
        }

        // Check if user already has this book borrowed
        const existingBorrow = await Borrow.findOne({
            userId,
            bookId,
            status: 'borrowed'
        });

        if (existingBorrow) {
            return res.status(400).json({ message: "User already has this book borrowed" });
        }

        // Create new borrow record
        const newBorrow = new Borrow({
            userId,
            bookId,
            dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Default to 14 days from now
            status: 'borrowed'
        });

        // Update book available copies
        book.availableCopies -= 1;
        await book.save();

        await newBorrow.save();
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: newBorrow
        });
    } catch (error) {
        console.error("Error creating borrow record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all borrow records
export const getBorrows = async (req, res) => {
    try {
        const borrows = await Borrow.find()
            .populate('userId', 'name email')
            .populate('bookId', 'title author isbn');
        
        res.status(200).json({
            success: true,
            message: "Borrow records fetched successfully",
            data: borrows
        });
    } catch (error) {
        console.error("Error fetching borrow records:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get borrow records by user ID
export const getBorrowsByUser = async (req, res) => {
    try {
        const userId = req.user._id; // Get user ID from authenticated user
        const borrows = await Borrow.find({ userId })
            .populate('bookId', 'title author isbn');
        
        res.status(200).json({
            success: true,
            message: "User borrow records fetched successfully",
            data: borrows
        });
    } catch (error) {
        console.error("Error fetching user borrow records:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Return a book
export const returnBook = async (req, res) => {
    try {
        const { borrowId } = req.params;
        
        const borrow = await Borrow.findById(borrowId);
        if (!borrow) {
            return res.status(404).json({ message: "Borrow record not found" });
        }

        if (borrow.status === 'returned') {
            return res.status(400).json({ message: "Book already returned" });
        }

        // Update borrow record
        borrow.status = 'returned';
        borrow.returnDate = new Date();
        
        // Calculate fine if overdue
        const dueDate = new Date(borrow.dueDate);
        const returnDate = new Date();
        if (returnDate > dueDate) {
            const daysOverdue = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
            borrow.fine = daysOverdue * 0.50; // $0.50 per day
        }

        await borrow.save();

        // Update book available copies
        const book = await Book.findById(borrow.bookId);
        if (book) {
            book.availableCopies += 1;
            await book.save();
        }

        res.status(200).json({
            success: true,
            message: "Book returned successfully",
            data: borrow
        });
    } catch (error) {
        console.error("Error returning book:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Create a new borrow request
export const createBorrowRequest = async (req, res) => {
    try {
        const { bookId } = req.body;
        
        // Debug: Log request details
        console.log('createBorrowRequest - Request body:', req.body);
        console.log('createBorrowRequest - Authenticated user:', req.user);
        
        // Debug: Check if user is authenticated
        if (!req.user || !req.user._id) {
            console.error('User not authenticated or user ID missing:', req.user);
            return res.status(401).json({ 
                success: false,
                message: "User not authenticated" 
            });
        }
        
        const userId = req.user._id; // Get user ID from authenticated user

        // Validate required fields
        if (!bookId) {
            return res.status(400).json({ 
                success: false,
                message: "Book ID is required" 
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        // Check if book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ 
                success: false,
                message: "Book not found" 
            });
        }

        // Check if user already has a pending request for this book
        const existingRequest = await Borrow.findOne({
            userId,
            bookId,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ 
                success: false,
                message: "You already have a pending request for this book" 
            });
        }

        // Check if user already has this book borrowed
        const existingBorrow = await Borrow.findOne({
            userId,
            bookId,
            status: 'borrowed'
        });

        if (existingBorrow) {
            return res.status(400).json({ 
                success: false,
                message: "You already have this book borrowed" 
            });
        }

        // Create new borrow request
        const newRequest = new Borrow({
            userId,
            bookId,
            status: 'pending',
            borrowDate: new Date(), // This will be the request date
            requestDate: new Date()
        });

        await newRequest.save();
        res.status(201).json({
            success: true,
            message: "Borrow request submitted successfully",
            data: newRequest
        });
    } catch (error) {
        console.error("Error creating borrow request:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
};

// Get all borrow requests
export const getBorrowRequests = async (req, res) => {
    try {
        const requests = await Borrow.find()
            .populate('userId', 'name email')
            .populate('bookId', 'title author isbn')
            .sort({ requestDate: -1 }); // Most recent first
        
        res.status(200).json({
            success: true,
            message: "Borrow requests fetched successfully",
            data: requests
        });
    } catch (error) {
        console.error("Error fetching borrow requests:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Approve a borrow request
export const approveBorrowRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        
        console.log('approveBorrowRequest - Request ID:', requestId);
        
        const request = await Borrow.findById(requestId);
        if (!request) {
            return res.status(404).json({ 
                success: false,
                message: "Borrow request not found" 
            });
        }
        
        console.log('approveBorrowRequest - Found request:', request);

        if (request.status !== 'pending') {
            return res.status(400).json({ 
                success: false,
                message: "Request is not pending" 
            });
        }

        // Check if book has available copies
        const book = await Book.findById(request.bookId);
        if (!book) {
            return res.status(404).json({ 
                success: false,
                message: "Book not found" 
            });
        }

        console.log('approveBorrowRequest - Found book:', book);
        console.log('approveBorrowRequest - Book available copies:', book.availableCopies, 'Type:', typeof book.availableCopies);

        if (!book.availableCopies || book.availableCopies <= 0) {
            return res.status(400).json({ 
                success: false,
                message: "No copies available for borrowing" 
            });
        }

        // Update request status to approved
        request.status = 'approved';
        request.approvalDate = new Date();
        // Calculate due date (14 days from now)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);
        request.dueDate = dueDate;
        
        console.log('approveBorrowRequest - Updated request:', request);

        // Update book available copies
        if (typeof book.availableCopies === 'number') {
            book.availableCopies = Math.max(0, book.availableCopies - 1);
            console.log('approveBorrowRequest - Updated book available copies:', book.availableCopies);
            
            try {
                await book.save();
                console.log('approveBorrowRequest - Book saved successfully');
            } catch (bookSaveError) {
                console.error('approveBorrowRequest - Error saving book:', bookSaveError);
                return res.status(500).json({ 
                    success: false,
                    message: "Failed to save book",
                    error: bookSaveError.message
                });
            }
        } else {
            console.error('approveBorrowRequest - Book availableCopies is not a number:', book.availableCopies);
            return res.status(500).json({ 
                success: false,
                message: "Book data is corrupted" 
            });
        }

        console.log('approveBorrowRequest - Saving request...');
        console.log('approveBorrowRequest - Request object before save:', JSON.stringify(request, null, 2));
        
        try {
            await request.save();
            console.log('approveBorrowRequest - Request saved successfully');
        } catch (saveError) {
            console.error('approveBorrowRequest - Error saving request:', saveError);
            return res.status(500).json({ 
                success: false,
                message: "Failed to save request",
                error: saveError.message
            });
        }

        res.status(200).json({
            success: true,
            message: "Borrow request approved successfully",
            data: request
        });
    } catch (error) {
        console.error("Error approving borrow request:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
};

// Reject a borrow request
export const rejectBorrowRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        
        const request = await Borrow.findById(requestId);
        if (!request) {
            return res.status(404).json({ 
                success: false,
                message: "Borrow request not found" 
            });
        }
        
        if (request.status !== 'pending') {
            return res.status(400).json({ 
                success: false,
                message: "Request is not pending" 
            });
        }

        // Update request status to rejected
        request.status = 'rejected';
        request.rejectionDate = new Date();

        await request.save();

        res.status(200).json({
            success: true,
            message: "Borrow request rejected successfully",
            data: request
        });
    } catch (error) {
        console.error("Error rejecting borrow request:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
};
