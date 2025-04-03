const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Product = require('../models/savedProducts');

// GET all saved products for a user
router.get('/saved', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    console.log('GET /products/saved for userId:', userId);

    // Direct query to check if entries exist in the collection
    const allProductEntries = await mongoose.connection.db.collection('products').find({}).toArray();
    console.log('Direct query results:', allProductEntries.length);
    if (allProductEntries.length > 0) {
      console.log('Sample entry:', JSON.stringify(allProductEntries[0]));
    }
    
    // Get all saved products for this user
    const savedProducts = await Product.find({ userId });
    console.log('Saved products found:', savedProducts.length);
    console.log('Raw entries:', JSON.stringify(savedProducts));
    
    // Format the response
    const formattedProducts = savedProducts.map(item => ({
      _id: item._id,
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      store: item.store,
      description: item.description,
      productUrl: item.productUrl,
      category: item.category,
      dateAdded: item.dateAdded
    }));
    
    console.log('Final formatted response:', JSON.stringify(formattedProducts));
    return res.json(formattedProducts);
    
  } catch (err) {
    console.error('Error fetching saved products:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// POST - Save or unsave a product
router.post('/save', auth, async (req, res) => {
  try {
    console.log('POST /products/save endpoint hit');
    console.log('Request body:', req.body);
    console.log('User from token:', req.user);
    
    const { productId, productData } = req.body;
    const userId = req.user.userId || req.user.id; // Try both possible fields
    
    if (!productId) {
      return res.status(400).json({ msg: 'Product ID is required' });
    }
    
    console.log('Checking if product already saved for userId:', userId, 'productId:', productId);
    
    // Check if product is already saved
    const existingProduct = await Product.findOne({
      userId,
      productId
    });
    
    if (existingProduct) {
      // Remove the saved product (toggle functionality)
      console.log('Product already saved, removing:', existingProduct._id);
      await Product.findByIdAndDelete(existingProduct._id);
      return res.json({ msg: 'Product removed from saved items', saved: false });
    }
    
    // Create a new Product document
    const newProduct = new Product({
      userId,
      productId,
      name: productData.name,
      price: productData.price,
      image: productData.image,
      store: productData.store,
      description: productData.description,
      productUrl: productData.productUrl,
      category: productData.category,
      dateAdded: new Date()
    });
    
    console.log('Product document to save:', newProduct);
    
    try {
      const saved = await newProduct.save();
      console.log('Product saved successfully:', saved);
      res.json({ 
        msg: 'Product saved successfully', 
        saved: true, 
        id: saved._id 
      });
    } catch (saveErr) {
      console.error('Error during save operation:', saveErr);
      res.status(500).json({ msg: 'Error saving to database', error: saveErr.message });
    }
  } catch (err) {
    console.error('General error in POST /products/save:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// DELETE a saved product
router.delete('/saved/:id', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const productId = req.params.id;
    
    console.log(`DELETE /products/saved/${productId} for userId:`, userId);
    
    // Find and delete the saved product
    const savedProduct = await Product.findOne({
      productId,
      userId
    });
    
    if (!savedProduct) {
      return res.status(404).json({ msg: 'Saved product not found' });
    }
    
    await Product.findByIdAndDelete(savedProduct._id);
    
    res.json({ msg: 'Product removed from saved items' });
  } catch (err) {
    console.error('Error deleting saved product:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// DELETE all saved products for a user
router.delete('/saved', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    
    console.log('DELETE /products/saved (all) for userId:', userId);
    
    // Delete all saved products for this user
    const result = await Product.deleteMany({ userId });
    
    console.log('Deleted products count:', result.deletedCount);
    
    res.json({ 
      msg: 'All saved products cleared',
      count: result.deletedCount
    });
  } catch (err) {
    console.error('Error clearing saved products:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;