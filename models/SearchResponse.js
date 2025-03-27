const mongoose = require('mongoose');

const SearchResponseSchema = new mongoose.Schema({
  query: { type: String, required: true }, // Search term
  products: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      rating: { type: Number, default: 0 },
      shippingCost: { type: Number, default: 0 },
      paymentMethod: { type: String, default: "Unknown" },
      source: { type: String, required: true }, // e.g., Amazon, eBay
      url: { type: String, required: true }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SearchResponse', SearchResponseSchema);
