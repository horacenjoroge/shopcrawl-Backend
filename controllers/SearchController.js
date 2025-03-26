const SearchQuery = require('../models/SearchQuery');

async function saveSearchQuery(query, userId = null) {
  try {
    const newSearch = new SearchQuery({ query, userId });
    await newSearch.save();
    console.log(" Search query saved:", query);
  } catch (error) {
    console.error(" Error saving search query:", error);
  }
}



// history
const SearchHistory = require('../models/SearchHistory');

async function saveSearchHistory(userId, query) {
  try {
    let history = await SearchHistory.findOne({ userId });

    if (!history) {
      history = new SearchHistory({ userId, searches: [] });
    }

    history.searches.push({ query });
    await history.save();
    console.log(" Search history updated:", query);
  } catch (error) {
    console.error(" Error saving search history:", error);
  }
}

// search response

const SearchResponse = require('../models/SearchResponse');

async function saveSearchResponse(query, products) {
  try {
    const newResponse = new SearchResponse({ query, products });
    await newResponse.save();
    console.log(" Search response saved for:", query);
  } catch (error) {
    console.error("Error saving search response:", error);
  }
}



module.exports = {
    saveSearchQuery,
    saveSearchHistory,
    saveSearchResponse
}
