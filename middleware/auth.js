const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  console.log('=== Auth Middleware Running ===');
  console.log('Headers received:', Object.keys(req.headers));
  
  // Get auth header
  const authHeader = req.header('Authorization');
  console.log('Authorization header:', authHeader);
  
  // Also check for x-auth-token header as fallback
  const xAuthToken = req.header('x-auth-token');
  if (xAuthToken && !authHeader) {
    console.log('Found x-auth-token instead of Authorization header');
    try {
      const decoded = jwt.verify(xAuthToken, process.env.JWT_SECRET);
      console.log('Token decoded successfully from x-auth-token:', decoded);
      req.user = decoded;
      return next();
    } catch (err) {
      console.error('JWT verification error from x-auth-token:', err);
    }
  }
  
  // Check if auth header exists
  if (!authHeader) {
    console.log('No Authorization header found');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  
  // Check if it starts with "Bearer "
  if (!authHeader.startsWith('Bearer ')) {
    console.log('Invalid token format, missing Bearer prefix');
    return res.status(401).json({ msg: 'Invalid token format' });
  }
  
  // Extract the token (remove "Bearer " prefix)
  const token = authHeader.split(' ')[1];
  console.log('Token extracted, first 15 chars:', token ? token.substring(0, 15) + '...' : 'null');
  
  try {
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', JSON.stringify(decoded));
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification error:', err.name, err.message);
    res.status(401).json({ msg: 'Invalid token' });
  }
};
