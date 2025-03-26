const express = require("express");
const router = express.Router();
const fetchProducts = require("../utils/fetchProducts");
const fetchProductDetails = require("../utils/fetchProductDetails");
const fetchProductReviews = require("../utils/fetchProductReviews");
const fetchProductOffers = require("../utils/fetchProductOffers");
const fetchProductsByCategory = require("../utils/fetchProductsByCategory");

// Search for products
router.get("/search", async (req, res) => {
  try {
    const query = (req.query.q || "").trim();
    const page = parseInt(req.query.page) || 1;

    if (!query) return res.status(400).json({ message: "Query is required" });

    console.log("🔍 Searching:", query, "| Page:", page);

    const products = await fetchProducts(query, page);
    console.log("📦 Products Found:", products.length);

    res.json({ query, page, products });
  } catch (error) {
    console.error("❌ Error in search:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Fetch products by category
router.get("/category", async (req, res) => {
  try {
    const category = req.query.category || "";
    const page = parseInt(req.query.page) || 1;

    if (!category) return res.status(400).json({ message: "Category is required" });

    console.log("📂 Fetching products in category:", category, "| Page:", page);

    const products = await fetchProductsByCategory(category, page);
    res.json({ category, page, products });
  } catch (error) {
    console.error("❌ Error fetching category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Fetch product details
router.get("/product", async (req, res) => {
  try {
    const productId = req.query.id;
    if (!productId) return res.status(400).json({ message: "Product ID is required" });

    console.log("📜 Fetching product details for ID:", productId);
    const productDetails = await fetchProductDetails(productId);
    res.json(productDetails);
  } catch (error) {
    console.error("❌ Error fetching product details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Fetch product reviews
router.get("/reviews", async (req, res) => {
  try {
    const productId = req.query.id;
    if (!productId) return res.status(400).json({ message: "Product ID is required" });

    console.log("📝 Fetching reviews for product ID:", productId);
    const reviews = await fetchProductReviews(productId);
    res.json(reviews);
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Fetch product offers
router.get("/offers", async (req, res) => {
  try {
    const productId = req.query.id;
    if (!productId) return res.status(400).json({ message: "Product ID is required" });

    console.log("🎯 Fetching offers for product ID:", productId);
    const offers = await fetchProductOffers(productId);
    res.json(offers);
  } catch (error) {
    console.error("❌ Error fetching offers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
