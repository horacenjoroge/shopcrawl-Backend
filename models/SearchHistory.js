const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true  // Good for query performance
  },
  query: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true  // Good for sorting by date
  },
  imageUrl: { 
    type: String, 
    default: null 
  },
  category: {
    type: String,
    default: null
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('History', HistorySchema);