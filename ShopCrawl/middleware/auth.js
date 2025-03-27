const jwt = require('jsonwebtoken');

// Token blacklist storage (for now, using in-memory Set)
const blacklist = new Set();

const authMiddleware = (req, res, next) => {
  // Get auth header
  const authHeader = req.header('Authorization');

  // Check if auth header exists
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Check if it starts with "Bearer "
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Invalid token format' });
  }

  // Extract the token (remove "Bearer " prefix)
  const token = authHeader.split(' ')[1];

  // Check if the token is blacklisted
  if (blacklist.has(token)) {
    return res.status(401).json({ msg: 'Token is invalid. Please log in again.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(401).json({ msg: 'Invalid token' });
  }
};

// Logout function to blacklist tokens
const logoutUser = (req, res) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(400).json({ msg: 'No token provided' });
  }

  blacklist.add(token); // Add token to blacklist
  console.log('🚫 Token Blacklisted:', token);

  res.json({ msg: 'Logged out successfully' });
};

module.exports = { authMiddleware, logoutUser, blacklist };
