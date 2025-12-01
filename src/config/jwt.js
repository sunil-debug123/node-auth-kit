/**
 * JWT Configuration
 * Contains token expiration times and secret keys
 */
module.exports = {
  // Access token expires in 15 minutes
  accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
  
  // Refresh token expires in 7 days
  refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  
  // Access token secret
  accessTokenSecret: process.env.JWT_ACCESS_SECRET || 'your-access-token-secret-change-in-production',
  
  // Refresh token secret
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-token-secret-change-in-production',
  
  // Password reset token expires in 1 hour
  passwordResetExpiry: process.env.JWT_PASSWORD_RESET_EXPIRY || '1h',
  
  // Password reset secret
  passwordResetSecret: process.env.JWT_PASSWORD_RESET_SECRET || 'your-password-reset-secret-change-in-production',
};

