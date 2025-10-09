import Product from "../models/product.model.js";
import HttpException from "../utils/exceptions/http.exception.js";

// GET /api/collections/:name
export const getCollectionProducts = async (req, res, next) => {
  try {
    const name = (req.params?.name || "").toString().trim();
    // empty or invalid just returns empty results per spec
    if (!name) {
      return res.status(200).json({ collection: name, products: [] });
    }

    const products = await Product.find({ collection: name });
    return res.status(200).json({ collection: name, products });
  } catch (err) {
    next(new HttpException(500, "Failed to fetch collection products"));
  }
}


