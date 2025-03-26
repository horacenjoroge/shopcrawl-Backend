require("dotenv").config();
const axios = require("axios");

const API_URL = "https://real-time-product-search.p.rapidapi.com/search";
const API_KEY = process.env.RAPIDAPI_KEY;
const API_HOST = "real-time-product-search.p.rapidapi.com";

// Fetch products function
const fetchProducts = async (searchQuery, page = 1) => {
  try {
    if (!searchQuery) {
      throw new Error("Search query is required");
    }

    console.log(`🔍 Searching for: "${searchQuery}" | Page: ${page}`);

    // Fetch from RapidAPI
    const response = await axios.get(API_URL, {
      params: { q: searchQuery, country: "us", language: "en", page },
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": API_HOST,
      },
    });

    const products = response.data.products || [];
    console.log(`✅ Found ${products.length} products from API`);

    return products;
  } catch (error) {
    console.error("❌ Error fetching products:", error.response?.data || error.message);
    return []; // Return empty array to prevent crashes
  }
};

module.exports = fetchProducts;
