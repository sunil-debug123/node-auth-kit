const Joi = require('joi');

/**
 * Validation schemas using Joi
 */

// User registration validation
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim().required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters',
  }),
  email: Joi.string().email().lowercase().trim().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
  role: Joi.string().valid('user', 'admin').default('user'),
});

// User login validation
const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

// Password reset request validation
const passwordResetRequestSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email',
  }),
});

// Password reset validation
const passwordResetSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Reset token is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
});

// Update profile validation
const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim().optional(),
  email: Joi.string().email().lowercase().trim().optional(),
});

// Change password validation
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'string.empty': 'Current password is required',
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.empty': 'New password is required',
    'string.min': 'New password must be at least 6 characters',
  }),
});

/**
 * Validate request data against schema
 * @param {Object} schema - Joi schema
 * @param {Object} data - Data to validate
 * @returns {Object} - { error, value }
 */
const validate = (schema, data) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false, // Return all errors, not just the first one
    stripUnknown: true, // Remove unknown fields
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    return { error: errors, value: null };
  }

  return { error: null, value };
};

module.exports = {
  registerSchema,
  loginSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  updateProfileSchema,
  changePasswordSchema,
  validate,
};

