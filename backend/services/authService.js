const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Hashes a plain text password using bcrypt.
 * @param {string} password - The plain text password.
 * @returns {Promise<string>} - A promise that resolves to the hashed password.
 */
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compares a plain text password with a hashed password.
 * @param {string} password - The plain text password.
 * @param {string} hash - The hashed password.
 * @returns {Promise<boolean>} - A promise that resolves to true if the password matches, otherwise false.
 */
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

/**
 * Generates a JSON Web Token (JWT) for the given payload.
 * @param {Object} payload - The data to encode in the token.
 * @returns {string} - The signed JWT string.
 */
function generateToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign(payload, secret, { expiresIn: '1h' });
}

/**
 * Verifies a JSON Web Token (JWT) and returns its decoded payload.
 * @param {string} token - The JWT string to verify.
 * @returns {Object} - The decoded token payload.
 * @throws {Error} - If the token is invalid or expired.
 */
function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.verify(token, secret);
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
};