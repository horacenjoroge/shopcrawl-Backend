const mongoose = require("mongoose");

const searchResponseSchema = new mongoose.Schema({
  query: { type: String, required: true },
  products: [{ type: mongoose.Schema.Types.Mixed, required: true }], // Store product details as an array
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SearchResponse", searchResponseSchema);
