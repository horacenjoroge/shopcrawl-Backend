const axios = require("axios");

const fetchProductDetails = async (productId) => {
  try {
    const options = {
      method: "GET",
      url: `https://your-rapidapi-endpoint.com/product/${productId}`,
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "real-time-product-search.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    return response.data || {};
  } catch (error) {
    console.error("❌ Error fetching product details:", error.message);
    return {};
  }
};

module.exports = fetchProductDetails;
