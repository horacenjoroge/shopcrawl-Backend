const mongoose = require("mongoose");

const SearchQuerySchema = new mongoose.Schema({
  query: { type: String, required: true, index: true }, // Indexed for faster lookups
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Nullable for guests
  createdAt: { type: Date, default: Date.now },
});

// Indexing for fast queries
SearchQuerySchema.index({ query: 1, userId: 1 });

module.exports = mongoose.model("SearchQuery", SearchQuerySchema);
