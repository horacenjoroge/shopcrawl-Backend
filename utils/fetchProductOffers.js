const axios = require("axios");

const fetchProductOffers = async (productId) => {
  try {
    const options = {
      method: "GET",
      url: `https://your-rapidapi-endpoint.com/product/${productId}/offers`,
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "real-time-product-search.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    return response.data.offers || [];
  } catch (error) {
    console.error("❌ Error fetching product offers:", error.message);
    return [];
  }
};

module.exports = fetchProductOffers;
