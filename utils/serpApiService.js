const axios = require("axios");

const SERPAPI_KEY = process.env.SERPAPI_KEY;
const BASE_URL = "https://serpapi.com/search.json";

// Fetch products from SerpApi
const fetchProductsFromSerpApi = async (query, page = 1) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        engine: "google_shopping",
        q: query,
        hl: "en",
        gl: "us",
        start: (page - 1) * 10, // Pagination
        api_key: SERPAPI_KEY,
      },
    });

    return response.data.shopping_results || [];
  } catch (error) {
    console.error("❌ Error fetching from SerpApi:", error.response?.data || error.message);
    throw new Error("Failed to fetch products from SerpApi");
  }
};

module.exports = { fetchProductsFromSerpApi };
