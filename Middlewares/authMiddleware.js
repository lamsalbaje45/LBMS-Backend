import jwt from 'jsonwebtoken';
import User from '../Models/user.js';
export const authMiddleware = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "Authentication token is missing"
            });
        }
        // Verify the token
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET environment variable is not set');
            return res.status(500).json({ 
                success: false,
                message: "Server configuration error"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({
            success: false,
            message: "Unauthorized access",
            error: error.message
        });
    }
}

export const authorizeRoles = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You do not have permission to perform this action"
            });
        }
        next();
    };
}


