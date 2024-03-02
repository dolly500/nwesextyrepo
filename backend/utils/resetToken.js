const crypto = require('crypto');

// Function to generate a random 6-digit number
function generateRandomSixDigitNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Function to generate a reset token
function generateResetToken() {
  const resetToken = generateRandomSixDigitNumber().toString();
  const resetTokenHash = hashString(resetToken); // Hashing the token
  const resetTokenExpiry = Date.now() + 3600000; // Token expiry time (1 hour)
  return { token: resetToken, hash: resetTokenHash, expiry: resetTokenExpiry };
}

// Function to hash a string using SHA256 algorithm
function hashString(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

module.exports = { generateResetToken };
