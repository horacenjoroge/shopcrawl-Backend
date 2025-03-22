var express = require('express');
var router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

//Signup Route
router.post('/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: 'User already exists 😶' });
  
      // Create user (password will be hashed in the schema hook)
      user = new User({ username, email, password });
      await user.save();
  
      // Generate JWT Token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(201).json({ msg: 'User created successfully', token, userId: user._id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server Error' });
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
  
  
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
