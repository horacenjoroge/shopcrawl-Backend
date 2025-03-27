const SearchQuery = require("../models/SearchQuery");
const SearchHistory = require("../models/searchHistory");
const SearchResponse = require("../models/SearchResponse");

// Save Search Query in MongoDB
const saveSearchQuery = async (query) => {
  try {
    if (!query) return;

    const searchEntry = new SearchQuery({ query });
    await searchEntry.save();

    // Keep only the last 10 searches
    const recentSearches = await SearchQuery.find().sort({ createdAt: -1 }).limit(10);
    await SearchQuery.deleteMany({ _id: { $nin: recentSearches.map((s) => s._id) } });

    console.log("✅ Search query saved:", query);
  } catch (error) {
    console.error("❌ Error saving search query:", error);
  }
};

// Save User Search History in MongoDB
const saveSearchHistory = async (userId, query) => {
  try {
    if (!userId || !query) return;

    let history = await SearchHistory.findOne({ userId });

    if (!history) {
      history = new SearchHistory({ userId, searches: [] });
    }

    history.searches.push({ query, timestamp: new Date() });

    // Keep only the last 20 searches per user
    if (history.searches.length > 20) {
      history.searches = history.searches.slice(-20);
    }

    await history.save();
    console.log(`📜 Search history updated for User ${userId}: ${query}`);
  } catch (error) {
    console.error("❌ Error saving search history:", error);
  }
};

// Save API Search Response in MongoDB
const saveSearchResponse = async (query, products) => {
  try {
    if (!query || !products.length) return;

    const newResponse = new SearchResponse({ query, products });
    await newResponse.save();

    console.log(`📦 Search response saved for "${query}" with ${products.length} products.`);
  } catch (error) {
    console.error("❌ Error saving search response:", error);
  }
};

module.exports = {
  saveSearchQuery,

};
