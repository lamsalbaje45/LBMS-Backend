import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    isbn: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    genre: {
        type: String,
        required: true,
        trim: true,
    },
    publicationYear: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    availableCopies: {
        type: Number,
        required: true,
        min: 0,
    },
    coverImage: {
        type: String,
        default: 'default-cover.jpg'
    }
}, {
    timestamps: true
});

const Book = mongoose.model('Book', bookSchema);
export default Book;
