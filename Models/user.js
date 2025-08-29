import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false, // Exclude password from queries by default
        trim: true,
    },
    role: {
        type: String,
        enum: ['admin', 'librarian', 'borrower'],
        default: 'borrower'
    },
    profileImage: {
        type: String,
        default: 'default-profile.png', // Default profile image
        trim: true,
    },
    resetPasswordToken: {
        type: String,
        default: undefined
    },
    resetPasswordExpires: {
        type: Date,
        default: undefined
    }
});

const User = mongoose.model('User', userSchema);
export default User;