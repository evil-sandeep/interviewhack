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
      
      // Inject user object natively into Express Request pipeline
      req.user = await User.findById(decoded.id).select('-password');
      
      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }
};
