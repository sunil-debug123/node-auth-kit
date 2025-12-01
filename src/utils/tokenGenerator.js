const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

/**
 * Generate JWT Access Token
 * @param {Object} payload - User data to encode in token
 * @returns {string} - JWT access token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, jwtConfig.accessTokenSecret, {
    expiresIn: jwtConfig.accessTokenExpiry,
  });
};

/**
 * Generate JWT Refresh Token
 * @param {Object} payload - User data to encode in token
 * @returns {string} - JWT refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, jwtConfig.refreshTokenSecret, {
    expiresIn: jwtConfig.refreshTokenExpiry,
  });
};

/**
 * Generate Password Reset Token
 * @param {Object} payload - User data to encode in token
 * @returns {string} - JWT password reset token
 */
const generatePasswordResetToken = (payload) => {
  return jwt.sign(payload, jwtConfig.passwordResetSecret, {
    expiresIn: jwtConfig.passwordResetExpiry,
  });
};

/**
 * Verify JWT Access Token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, jwtConfig.accessTokenSecret);
};

/**
 * Verify JWT Refresh Token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, jwtConfig.refreshTokenSecret);
};

/**
 * Verify Password Reset Token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 */
const verifyPasswordResetToken = (token) => {
  return jwt.verify(token, jwtConfig.passwordResetSecret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generatePasswordResetToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyPasswordResetToken,
};

