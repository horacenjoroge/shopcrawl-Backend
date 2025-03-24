const express = require('express');
const router = express.Router();
const fetchProducts = require('../utils/fetchProducts');
const { saveSearchQuery, saveSearchHistory, saveSearchResponse } = require('../controllers/searchController');

router.get('/search', async (req, res) => {
  try {
    const { query, userId } = req.query;

    if (!query) return res.status(400).json({ message: "Query is required" });

    // Save search query
    await saveSearchQuery(query, userId);

    // Fetch products
    const products = await fetchProducts(query);

    // Save search history (only if user is logged in)
    if (userId) await saveSearchHistory(userId, query);

    // Save search response
    await saveSearchResponse(query, products);

    res.json({ query, products });
  } catch (error) {
    console.error("❌ Error in search route:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
