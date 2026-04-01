const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate JWT tokens.
 * Expects Authorization header in the format: Bearer <token>
 * On success, attaches the decoded user object to req.user and calls next().
 * On failure, responds with 401 Unauthorized.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.sendStatus(401); // Unauthorized if no token provided
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Server configuration error
    return res.sendStatus(500);
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      // Token is invalid or expired
      return res.sendStatus(403); // Forbidden
    }
    // Attach the decoded user payload to the request object
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  });
}

module.exports = {
  authenticateToken,
};