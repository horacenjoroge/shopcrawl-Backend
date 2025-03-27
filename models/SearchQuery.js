const mongoose = require('mongoose');

const SearchQuerySchema = new mongoose.Schema({
  query: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Nullable for guest users
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SearchQuery', SearchQuerySchema);
