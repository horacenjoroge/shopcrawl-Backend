const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: String
  },
  image: {
    type: String
  },
  store: {
    type: String
  },
  description: {
    type: String
  },
  productUrl: {
    type: String
  },
  category: {
    type: String
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure a user can't save the same product twice
ProductSchema.index({ user: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('product', ProductSchema);
