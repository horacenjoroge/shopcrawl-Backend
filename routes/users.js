var express = require('express');
var router = express.Router();


const User = require('../models/User');
const auth = require('../middleware/auth');
const { logoutUser } = require('../middleware/auth');



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

// Delete user account
router.delete('/:id', async (req, res) => {
  try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      
      if (!deletedUser) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});

// Change user password
router.put('/:id/password', async (req, res) => {
  try {
      const { oldPassword, newPassword } = req.body;

      // Find user by ID
      const user = await User.findById(req.params.id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Check if old password is correct
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: 'Incorrect old password' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      res.json({ message: 'Password updated successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});

// Deactivate user account
router.put('/:id/deactivate', async (req, res) => {
  try {
      const user = await User.findByIdAndUpdate(
          req.params.id,
          { isActive: false },
          { new: true }
      ).select('-password'); // Exclude password from response

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User account deactivated successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});

// Reactivate user account
router.put('/:id/reactivate', async (req, res) => {
  try {
      const user = await User.findByIdAndUpdate(
          req.params.id,
          { isActive: true },
          { new: true }
      ).select('-password'); // Exclude password from response

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User account reactivated successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});

// Update user role (Admin only)
router.put('/:id/role', async (req, res) => {
  try {
      const { role } = req.body;
      const validRoles = ['user', 'admin'];

      if (!validRoles.includes(role)) {
          return res.status(400).json({ message: 'Invalid role' });
      }

      const user = await User.findByIdAndUpdate(
          req.params.id,
          { role },
          { new: true }
      ).select('-password'); // Exclude password from response

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: `User role updated to ${role}` });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});

// Get users by role
router.get('/role/:role', async (req, res) => {
  try {
      const { role } = req.params;
      const validRoles = ['user', 'admin'];

      if (!validRoles.includes(role)) {
          return res.status(400).json({ message: 'Invalid role' });
      }

      const users = await User.find({ role }).select('-password'); // Exclude passwords

      res.json(users);
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});

const bcrypt = require('bcryptjs');

// Change user password
router.put('/:id/change-password', async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // Find user by ID
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if old password matches
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect old password' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
  

///user logout
// Temporary in-memory blacklist (for now)
const blacklist = new Set();

// Logout Route (No Middleware)
router.post('/logout', (req, res) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(400).json({ msg: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  // Add token to blacklist
  blacklist.add(token);
  console.log('🚫 Token Blacklisted:', token);

  res.json({ msg: 'Logged out successfully' });
});

// Function to check if a token is blacklisted (Use this in protected routes)
const isTokenBlacklisted = (token) => blacklist.has(token);



/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
