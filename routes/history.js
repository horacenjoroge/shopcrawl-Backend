// Backend API - routes/history.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET user search history
// GET /api/history
// Private route - requires auth token
router.get('/', auth,async (req, res) => {
  try {
    // Get the user's search history from database
    // This is just sample data - in a real app, you'd fetch from a database
    const searchHistory = {
      today: [
        {
          id: 1,
          query: "Gaming Monitor Suggestions",
          timestamp: new Date(),
          imageUrl: "https://yourapi.com/images/monitors/gaming.jpg"
        }
      ],
      pastWeek: [
        {
          id: 2,
          query: "Mindfulness Books for Beginners",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          imageUrl: "https://yourapi.com/images/books/mindfulness.jpg"
        },
        {
          id: 3,
          query: "Hopkins Furniture Options",
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          imageUrl: null // Some items might not have images
        }
      ],
      pastMonth: [
        {
          id: 4,
          query: "Curved Monitor Options",
          timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          imageUrl: "https://yourapi.com/images/monitors/curved.jpg"
        }
        // Add more items as needed
      ]
    };

    return res.json(searchHistory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE a history item
// DELETE /api/history/:id
// Private route
router.delete('/:id', auth, async (req, res) => {
  try {
    // In a real app, you would delete from your database
    // For this example, just return success
    res.json({ success: true, msg: `History item ${req.params.id} deleted` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Clear all history
// DELETE /api/history
// Private route
router.delete('/', auth, async (req, res) => {
  try {
    // In a real app, you would delete all user history from your database
    // For this example, just return success
    res.json({ success: true, msg: 'All history cleared' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;