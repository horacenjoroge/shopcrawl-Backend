const mongoose = require('mongoose');

// Individual search entry schema
const SearchEntrySchema = new mongoose.Schema({
  query: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  imageUrl: { 
    type: String, 
    default: null 
  },
  category: {
    type: String,
    default: null
  }
});

// Main search history schema
const SearchHistorySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true  // Add index for faster queries
  },
  searches: [SearchEntrySchema]
}, {
  timestamps: true  // Adds createdAt and updatedAt fields automatically
});

// Add index on timestamp for faster time-based queries
SearchHistorySchema.index({ 'searches.timestamp': -1 });

module.exports = mongoose.model('SearchHistory', SearchHistorySchema);