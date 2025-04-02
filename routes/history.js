const express = require('express');
const router = express.Router();  
const mongoose = require('mongoose'); /// Add this line to initialize the router
const auth = require('../middleware/auth');
const History = require('../models/SearchHistory');

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    console.log('GET /history for userId:', userId);

    // Direct query to check if entries exist in the collection
    const allHistoryEntries = await mongoose.connection.db.collection('searchhistories').find({}).toArray();
    console.log('Direct query results:', allHistoryEntries.length);
    if (allHistoryEntries.length > 0) {
      console.log('Sample entry:', JSON.stringify(allHistoryEntries[0]));
    }
    
    // Get all history entries without time filtering
    const allEntries = await History.find({ userId });
    console.log('All history entries found:', allEntries.length);
    console.log('Raw entries:', JSON.stringify(allEntries));
    
    // Get current date info with proper time zone
    const now = new Date();
    console.log('Current server time:', now);
    
    // Create date boundaries using the same time zone
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    startOfWeek.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(now);
    startOfMonth.setDate(now.getDate() - 30);
    startOfMonth.setHours(0, 0, 0, 0);
    
    console.log('Date ranges for filtering:');
    console.log('- Today starts at:', startOfToday);
    console.log('- Week starts at:', startOfWeek);
    console.log('- Month starts at:', startOfMonth);
    
    // Manually categorize entries to verify filtering logic
    const today = [];
    const pastWeek = [];
    const pastMonth = [];
    
    allEntries.forEach(entry => {
      const entryDate = new Date(entry.timestamp);
      console.log(`Entry ${entry._id} timestamp:`, entryDate);
      
      if (entryDate >= startOfToday) {
        console.log(`Entry ${entry._id} added to today`);
        today.push(entry);
      } else if (entryDate >= startOfWeek) {
        console.log(`Entry ${entry._id} added to pastWeek`);
        pastWeek.push(entry);
      } else if (entryDate >= startOfMonth) {
        console.log(`Entry ${entry._id} added to pastMonth`);
        pastMonth.push(entry);
      } else {
        console.log(`Entry ${entry._id} too old, not included`);
      }
    });
    
    // Format the response
    const formattedHistory = {
      today: today.map(item => ({
        _id: item._id,
        query: item.query,
        timestamp: item.timestamp,
        imageUrl: item.imageUrl
      })),
      pastWeek: pastWeek.map(item => ({
        _id: item._id,
        query: item.query,
        timestamp: item.timestamp,
        imageUrl: item.imageUrl
      })),
      pastMonth: pastMonth.map(item => ({
        _id: item._id,
        query: item.query,
        timestamp: item.timestamp,
        imageUrl: item.imageUrl
      }))
    };
    
    console.log('Final formatted response:', JSON.stringify(formattedHistory));
    return res.json(formattedHistory);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// POST a new search history item
router.post('/', auth, async (req, res) => {
  try {
    console.log('POST /history endpoint hit');
    console.log('Request body:', req.body);
    console.log('User from token:', req.user);
    
    const { query, imageUrl } = req.body;
    const userId = req.user.userId || req.user.id; // Try both possible fields
    
    console.log('Creating history with userId:', userId, 'query:', query);
    
    // Create a new History document - log what we're trying to save
    const newHistory = new History({
      userId,
      query,
      imageUrl: imageUrl || null,
      timestamp: new Date()
    });
    
    console.log('History document to save:', newHistory);
    
    try {
      const saved = await newHistory.save();
      console.log('History saved successfully:', saved);
      res.json({ msg: 'Search added to history', id: saved._id });
    } catch (saveErr) {
      console.error('Error during save operation:', saveErr);
      res.status(500).json({ msg: 'Error saving to database', error: saveErr.message });
    }
  } catch (err) {
    console.error('General error in POST /history:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// DELETE a history item
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const historyId = req.params.id;
    
    // Find and delete the history item
    const historyItem = await History.findOne({
      _id: historyId,
      userId
    });
    
    if (!historyItem) {
      return res.status(404).json({ msg: 'History item not found' });
    }
    
    await History.findByIdAndDelete(historyId);
    
    res.json({ msg: 'History item deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// DELETE all history for a user
router.delete('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Delete all history for this user
    await History.deleteMany({ userId });
    
    res.json({ msg: 'All history cleared' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;