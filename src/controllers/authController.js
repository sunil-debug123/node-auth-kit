const {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  generatePasswordReset,
  resetPassword,
} = require('../services/authService');
const { sendPasswordResetEmail, sendWelcomeEmail } = require('../services/emailService');
const { validate, registerSchema, loginSchema, passwordResetRequestSchema, passwordResetSchema } = require('../utils/validators');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const register = async (req, res) => {
  try {
    // Validate request data
    const { error, value } = validate(registerSchema, req.body);
    if (error) {
      return errorResponse(res, 400, 'Validation failed', error);
    }

    // Register user
    const result = await registerUser(value);

    // Send welcome email (optional, can be done asynchronously)
    try {
      await sendWelcomeEmail(result.user.email, result.user.name);
    } catch (emailError) {
      // Don't fail registration if email fails
      console.error('Welcome email failed:', emailError);
    }

    return successResponse(
      res,
      201,
      'User registered successfully',
      {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }
    );
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
const login = async (req, res) => {
  try {
    // Validate request data
    const { error, value } = validate(loginSchema, req.body);
    if (error) {
      return errorResponse(res, 400, 'Validation failed', error);
    }

    // Login user
    const result = await loginUser(value.email, value.password);

    return successResponse(
      res,
      200,
      'Login successful',
      {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }
    );
  } catch (error) {
    return errorResponse(res, 401, error.message);
  }
};

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return errorResponse(res, 400, 'Refresh token is required');
    }

    // Refresh access token
    const result = await refreshAccessToken(refreshToken);

    return successResponse(
      res,
      200,
      'Token refreshed successfully',
      result
    );
  } catch (error) {
    return errorResponse(res, 401, error.message);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (clear refresh token)
 * @access  Private
 */
const logout = async (req, res) => {
  try {
    await logoutUser(req.user._id);

    return successResponse(res, 200, 'Logout successful');
  } catch (error) {
    return errorResponse(res, 500, 'Logout failed. Please try again.');
  }
};

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  try {
    // Validate request data
    const { error, value } = validate(passwordResetRequestSchema, req.body);
    if (error) {
      return errorResponse(res, 400, 'Validation failed', error);
    }

    // Generate password reset token
    const resetToken = await generatePasswordReset(value.email);

    // Always return success message (don't reveal if email exists)
    if (resetToken) {
      // Send password reset email
      try {
        await sendPasswordResetEmail(value.email, resetToken);
      } catch (emailError) {
        console.error('Password reset email failed:', emailError);
        // Still return success to user
      }
    }

    return successResponse(
      res,
      200,
      'If an account with that email exists, a password reset link has been sent.'
    );
  } catch (error) {
    return errorResponse(res, 500, 'Failed to process password reset request.');
  }
};

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using token
 * @access  Public
 */
const resetPasswordHandler = async (req, res) => {
  try {
    // Validate request data
    const { error, value } = validate(passwordResetSchema, req.body);
    if (error) {
      return errorResponse(res, 400, 'Validation failed', error);
    }

    // Reset password
    await resetPassword(value.token, value.password);

    return successResponse(res, 200, 'Password reset successful. Please login with your new password.');
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPasswordHandler,
};

