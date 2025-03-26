const axios = require("axios");

const fetchProductReviews = async (productId) => {
  try {
    const options = {
      method: "GET",
      url: `https://your-rapidapi-endpoint.com/product/${productId}/reviews`,
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "real-time-product-search.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    return response.data.reviews || [];
  } catch (error) {
    console.error("❌ Error fetching product reviews:", error.message);
    return [];
  }
};

module.exports = fetchProductReviews;
