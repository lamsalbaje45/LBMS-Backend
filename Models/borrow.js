import mongoose from 'mongoose';

const borrowSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    borrowDate: {
        type: Date,
        default: Date.now,
        required: false
    },
    dueDate: {
        type: Date,
        required: false
    },
    returnDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'borrowed', 'returned', 'rejected', 'overdue'],
        default: 'borrowed'
    },
    fine: {
        type: Number,
        default: 0
    },
    requestDate: {
        type: Date,
        default: Date.now
    },
    approvalDate: {
        type: Date,
        default: null
    },
    rejectionDate: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const Borrow = mongoose.model('Borrow', borrowSchema);
export default Borrow;

