import mongoose from "mongoose";
import Product from "../models/product.model.js";
import HttpException from "../utils/exceptions/http.exception.js";

// make user text safe for RegExp
function escapeRegex(text = "") {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * GET /api/products
 * Optional query params:
 *  - category  (e.g. "Protein")
 *  - goals     (single or CSV, e.g. "Weight Loss" or "Weight Loss,Energy")
 *  - minPrice  (number)
 *  - maxPrice  (number)
 *  - search    (keyword in name/description)
 */
const getAllProducts = async (req, res) => {
  try {
    const category = req.query.category;
    const goals = req.query.goals;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const search = req.query.search;

    // build the MongoDB filter step by step
    const filter = {};

    // 1) category — exact match, ignore case
    if (category && category.trim() !== "") {
      const safe = escapeRegex(category.trim());
      filter.category = { $regex: `^${safe}$`, $options: "i" };
    }

    // 2) goals — match ANY of the given goals (OR semantics)
    if (goals && goals.length > 0) {
      let goalsArray;
      if (Array.isArray(goals)) {
        goalsArray = goals;
      } else {
        goalsArray = goals.split(",").map((g) => g.trim()).filter(Boolean);
      }
      if (goalsArray.length > 0) {
        filter.goals = { $in: goalsArray };
        // If you want "must have ALL goals", use: filter.goals = { $all: goalsArray };
      }
    }

    // 3) price range
    let min, max;
    if (minPrice !== undefined) {
      const n = Number(minPrice);
      if (isNaN(n)) return res.status(400).json({ error: "minPrice must be a number" });
      min = n;
    }
    if (maxPrice !== undefined) {
      const n = Number(maxPrice);
      if (isNaN(n)) return res.status(400).json({ error: "maxPrice must be a number" });
      max = n;
    }
    if (min !== undefined && max !== undefined && min > max) {
      return res.status(400).json({ error: "minPrice cannot be greater than maxPrice" });
    }
    if (min !== undefined || max !== undefined) {
      filter.price = {};
      if (min !== undefined) filter.price.$gte = min;
      if (max !== undefined) filter.price.$lte = max;
    }

    // 4) search — keyword in name/description (case-insensitive)
    if (search && search.trim() !== "") {
      const safeSearch = escapeRegex(search.trim());
      const pattern = new RegExp(safeSearch, "i");
      // You have multiple description fields; include them for better matches
      filter.$or = [
        { name: pattern },
        { description: pattern },
        { shortDescription: pattern },
        { longDescription: pattern },
      ];
    }

    // If no filters provided, filter is {}, returns all products
    const products = await Product.find(filter);
    return res.status(200).json(products);
  } catch (error) {
    // Handle any database errors
    console.error('Error fetching products:', error);
    res.status(500).json({
      message: 'Internal server error while fetching products',
      error: error.message
    });
  }
};

const getProductById = async(req,res)=>{
    //fetches ID from request parameters
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        //checks for validity of the id
        throw new HttpException(400, "Invalid ID format");
    }
    // fetches the product details if id is valid & exists
    const product = await Product.findById(id);
    if(!product){
        //sends 404 error if product not found
        throw new HttpException(404, "Product not found");
    }
    return res.json(product);
}

export {getAllProducts, getProductById}
