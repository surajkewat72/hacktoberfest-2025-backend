import jwt from 'jsonwebtoken';
import HttpException from '../utils/exceptions/http.exception.js';

/**
 * JWT Authentication Middleware
 * Verifies JWT token and sets req.user
 */
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return next(new HttpException(401, 'Access token is required'));
    }

    // For now, we'll use a simple secret. In production, use process.env.JWT_SECRET
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return next(new HttpException(403, 'Invalid or expired token'));
      }
      
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    next(new HttpException(500, 'Authentication error'));
  }
};

/**
 * Optional Authentication Middleware
 * Sets req.user if token is present, but doesn't require it
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    const secret = process.env.JWT_SECRET || 'your-secret-key';
    
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        req.user = null;
      } else {
        req.user = user;
      }
      next();
    });
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    req.user = null;
    next();
  }
};

export { authenticateToken, optionalAuth };
