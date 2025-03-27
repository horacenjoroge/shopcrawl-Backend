const axios = require("axios");

const fetchProductsByCategory = async (category, page = 1) => {
  try {
    const options = {
      method: "GET",
      url: "https://your-rapidapi-endpoint.com/category",
      params: { category, page },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "real-time-product-search.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    return response.data.products || [];
  } catch (error) {
    console.error("❌ Error fetching category products:", error.message);
    return [];
  }
};

module.exports = fetchProductsByCategory;
