const crypto = require('crypto');

// Generate random token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
  generateToken,
  generateVerificationCode
};