/**
 * Email validation utility
 * Provides email validation helper functions
 */

/**
 * Validate email format using regex
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Normalize email (lowercase, trim)
 * @param {string} email - Email to normalize
 * @returns {string} - Normalized email
 */
const normalizeEmail = (email) => {
  return email.toLowerCase().trim();
};

module.exports = {
  isValidEmail,
  normalizeEmail,
};

