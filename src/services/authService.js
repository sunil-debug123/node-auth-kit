const User = require('../models/User');
const {
  generateAccessToken,
  generateRefreshToken,
  generatePasswordResetToken,
  verifyRefreshToken,
  verifyPasswordResetToken,
} = require('../utils/tokenGenerator');

/**
 * Authentication service
 * Handles authentication-related business logic
 */

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - User object with tokens
 */
const registerUser = async (userData) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Create new user
  const user = await User.create(userData);

  // Generate tokens
  const tokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Save refresh token to database
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Return user data with tokens
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - User object with tokens
 */
const loginUser = async (email, password) => {
  // Find user and include password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    throw new Error('Account is deactivated. Please contact support.');
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate tokens
  const tokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Save refresh token to database
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Return user data with tokens
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} - New access token
 */
const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('Refresh token is required');
  }

  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user with this refresh token
    const user = await User.findById(decoded.userId).select('+refreshToken');

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Check if stored refresh token matches
    if (user.refreshToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }

    // Generate new access token
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);

    return {
      accessToken,
    };
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      throw new Error('Invalid or expired refresh token');
    }
    throw error;
  }
};

/**
 * Logout user (clear refresh token)
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    $unset: { refreshToken: 1 },
  });
};

/**
 * Generate password reset token
 * @param {string} email - User email
 * @returns {Promise<string>} - Password reset token
 */
const generatePasswordReset = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    // Don't reveal if email exists or not for security
    return null;
  }

  // Generate password reset token
  const tokenPayload = {
    userId: user._id.toString(),
    email: user.email,
  };

  const resetToken = generatePasswordResetToken(tokenPayload);

  // Save reset token to database
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save({ validateBeforeSave: false });

  return resetToken;
};

/**
 * Reset password using reset token
 * @param {string} token - Password reset token
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
const resetPassword = async (token, newPassword) => {
  try {
    // Verify reset token
    const decoded = verifyPasswordResetToken(token);

    // Find user with this reset token
    const user = await User.findOne({
      _id: decoded.userId,
      passwordResetToken: token,
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    // Check if token has expired
    if (user.passwordResetExpires < new Date()) {
      throw new Error('Reset token has expired');
    }

    // Update password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Clear refresh token to force re-login
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      throw new Error('Invalid or expired reset token');
    }
    throw error;
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  generatePasswordReset,
  resetPassword,
};

