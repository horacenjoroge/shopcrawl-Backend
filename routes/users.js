var express = require('express');
var router = express.Router();


const User = require('../models/User');
const auth = require('../middleware/auth');

// Get User Profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Get user profile by ID
router.get('/:id', async (req, res) => {
  try {
      const user = await User.findById(req.params.id).select('-password'); // Exclude password
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});


// Get all users
router.get('/', async (req, res) => {
  try {
      const users = await User.find().select('-password'); // Exclude passwords
      res.json(users);
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});


// Update user profile
router.put('/:id', async (req, res) => {
  try {
      const { username, email } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          { username, email },
          { new: true, runValidators: true }
      ).select('-password'); // Exclude password from response

      if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json(updatedUser);
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});



/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
