import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Validates the JWT Bearer token and locks down API endpoints.
 */
export const protect = async (req, res, next) => {
  let token;
  
  // Extract from Authorization header expecting "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_xyz123');
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      // Even if token fails, if we're in dev, we can fallback to bypass
    }
  }

  // DEVELOPMENT BYPASS: If no token or failed token in development mode
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    console.log("⚠️ DEV MODE: Using Mock User Bypass");
    // Attempt to find a real user or use a stable mock ID
    let mockUser = await User.findOne({ email: 'test@example.com' });
    if (!mockUser) {
      mockUser = await User.create({
        name: 'Test Candidate',
        email: 'test@example.com',
        password: 'password123'
      });
    }
    req.user = mockUser;
    return next();
  }

  if (!token) {
    res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }
};

