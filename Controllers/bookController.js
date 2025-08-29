import Book from "../Models/book.js";

// create a new book
export const createBook = async (req, res) => {
    try {
        const { title, author, isbn, quantity } = req.body;

        // Validate required fields
        if (!title || !author || !isbn || !quantity) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if book already exists
        const existingBook = await Book.findOne({ isbn });
        if (existingBook) {
            return res.status(400).json({ message: "Book with this ISBN already exists" });
        }

        // Create new book
        const newBook = new Book({
            title,
            author,
            isbn,
            genre: req.body.genre || 'General',
            publicationYear: req.body.publicationYear || new Date().getFullYear(),
            description: req.body.description || '',
            quantity,
            availableCopies: quantity // Initially available copies equal to total quantity
        });

        await newBook.save();
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: newBook
        });
    } catch (error) {
        console.error("Error creating book:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
// get all books
export const getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json({
                success: true,
                message: "Books fetched successfully",
                data: books
            });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error", 
            error: error.message
        });
    }
};
// get a book by id
export const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({
            success: true,
            message: "Book fetched successfully",
            data: book
        });
    }catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
// update a book by id
export const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, isbn, quantity } = req.body;

        // Validate required fields
        if (!title || !author || !isbn || !quantity) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if book exists
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Update book details
        book.title = title;
        book.author = author;
        book.isbn = isbn;
        book.genre = req.body.genre || book.genre;
        book.publicationYear = req.body.publicationYear || book.publicationYear;
        book.description = req.body.description || book.description;
        book.quantity = quantity;
        book.availableCopies = quantity; // Reset available copies to new quantity

        await book.save();
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: book
        });
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
// delete a book by id
export const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if book exists
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        // Delete book
        await Book.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Book deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};