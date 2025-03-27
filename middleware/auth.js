const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
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
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(401).json({ msg: 'Invalid token' });
  }
};
