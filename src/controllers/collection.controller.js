import Product from "../models/product.model.js";
import HttpException from "../utils/exceptions/http.exception.js";

// GET /api/collections/:name
export const getCollectionProducts = async (req, res, next) => {
  try {
    const name = (req.params?.name || "").toString().trim();
    // empty or invalid just returns empty results per spec
    if (!name) {
      return res.status(200).json({ collections: name, products: [] });
    }

    // Normalize input into a regex that is:
    //  - case-insensitive
    //  - tolerant of hyphens vs spaces vs multiple separators
    // Escape regex special chars, then allow separators between words
    const escapeRegex = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const safe = escapeRegex(name);
    // replace runs of hyphens / spaces / underscores with a pattern that matches any of them
    const tolerant = safe.replace(/[-_\s]+/g, "[-_\\s]*");
    const pattern = new RegExp(`^${tolerant}$`, "i");

    // Match any array element using $elemMatch + $regex
    const products = await Product.find({
      collections: { $elemMatch: { $regex: pattern } },
    });

    return res.status(200).json({ collections: name, products });
  } catch (err) {
    next(new HttpException(500, "Failed to fetch collections products"));
  }
}



