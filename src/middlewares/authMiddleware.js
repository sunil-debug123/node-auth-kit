const { verifyAccessToken } = require('../utils/tokenGenerator');
const { errorResponse } = require('../utils/responseFormatter');
const User = require('../models/User');

/**
 * Authentication middleware
 * Verifies JWT access token and attaches user to request object
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Authentication required. Please provide a valid token.');
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return errorResponse(res, 401, 'Authentication required. Please provide a valid token.');
    }

    try {
      // Verify token
      const decoded = verifyAccessToken(token);

      // Get user from database (exclude password and refreshToken)
      const user = await User.findById(decoded.userId).select('-password -refreshToken');

      if (!user) {
        return errorResponse(res, 401, 'User not found. Invalid token.');
      }

      if (!user.isActive) {
        return errorResponse(res, 401, 'Account is deactivated. Please contact support.');
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (tokenError) {
      if (tokenError.name === 'TokenExpiredError') {
        return errorResponse(res, 401, 'Token expired. Please login again.');
      }
      if (tokenError.name === 'JsonWebTokenError') {
        return errorResponse(res, 401, 'Invalid token. Please login again.');
      }
      throw tokenError;
    }
  } catch (error) {
    return errorResponse(res, 500, 'Authentication failed. Please try again.');
  }
};

module.exports = {
  authenticate,
};

