const { errorResponse } = require('../utils/responseFormatter');

/**
 * Role-based authorization middleware
 * Checks if user has required role(s) to access the route
 * @param {...string} roles - Roles allowed to access the route
 * @returns {Function} - Express middleware function
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if user is authenticated (should be set by authMiddleware)
    if (!req.user) {
      return errorResponse(res, 401, 'Authentication required.');
    }

    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        `Access denied. This route requires one of the following roles: ${roles.join(', ')}.`
      );
    }

    next();
  };
};

module.exports = {
  authorizeRoles,
};

