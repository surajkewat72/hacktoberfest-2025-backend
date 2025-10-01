import Product from '../models/product.model.js';

/**
 * Get all products from the database
 * @route GET /api/products
 * @returns {Array} products - Array of product objects or empty array if no products
 */
export const getAllProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find({});
    
    // Return products array (will be empty array if no products found)
    res.status(200).json(products);
  } catch (error) {
    // Handle any database errors
    console.error('Error fetching products:', error);
    res.status(500).json({
      message: 'Internal server error while fetching products',
      error: error.message
    });
  }
};
