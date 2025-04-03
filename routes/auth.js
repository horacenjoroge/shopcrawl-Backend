var express = require('express');
var router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Signup Route
router.post('/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({ 
          msg: 'Please provide username, email, and password',
          error: 'INCOMPLETE_DATA'
        });
      }
  
      // Check if user already exists
      let existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });
  
      if (existingUser) {
        // Determine which field already exists
        const existingField = existingUser.email === email ? 'email' : 'username';
        return res.status(400).json({ 
          msg: `User with this ${existingField} already exists`,
          error: 'USER_EXISTS',
          existingField: existingField
        });
      }
  
      // Create user (password will be hashed in the schema hook)
      const user = new User({ username, email, password });
      await user.save();
  
      // Generate JWT Token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      res.status(201).json({ 
        msg: 'User created successfully', 
        token, 
        user: { 
          id: user._id, 
          email: user.email,
          username: user.username 
        } 
      });
    } catch (err) {
      console.error(err);
      
      // Handle potential validation errors
      if (err.name === 'ValidationError') {
        return res.status(400).json({ 
          msg: 'Validation failed',
          error: 'VALIDATION_ERROR',
          details: err.errors 
        });
      }
      
      res.status(500).json({ 
        msg: 'Server Error', 
        error: 'SERVER_ERROR' 
      });
    }
  });
  
  // Login Route
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'User not found' });
  
      // Compare password using the schema method
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid password' });
  
      // Generate JWT Token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(200).json({ token, userId: user._id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server Error' });
    }
  });
  
  // Logout Route
  router.post('/logout', auth, async (req, res) => {
    try {
      // In a stateless JWT system, logout is primarily client-side
      // You might want to implement token blacklisting in a more complex system
      res.status(200).json({ msg: 'Logged out successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server Error' });
    }
  });

  // Delete User Route
  router.delete('/delete', auth, async (req, res) => {
    try {
      // Get user id from the authenticated request
      const userId = req.user.userId;
      
      // Delete the user
      const deletedUser = await User.findByIdAndDelete(userId);
      
      if (!deletedUser) {
        return res.status(404).json({ msg: 'User not found' });
      }
      
      res.status(200).json({ msg: 'User deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server Error' });
    }
  });
  
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;