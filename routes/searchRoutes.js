const express = require("express");
const router = express.Router();
const { fetchProductsFromSerpApi } = require("../utils/serpApiService");

// Search for products
router.get("/", async (req, res) => {
  try {
    const query = (req.query.q || "").trim();
    const page = parseInt(req.query.page) || 1;

    if (!query) return res.status(400).json({ message: "Query is required" });

    console.log("🔍 Searching:", query, "| Page:", page);

    const products = await fetchProductsFromSerpApi(query, page);
    console.log("📦 Products Found:", products.length);

    res.json({ query, page, products });
  } catch (error) {
    console.error("❌ Error in search:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
