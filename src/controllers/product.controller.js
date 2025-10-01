import mongoose from "mongoose";
import Product from "../models/product.model.js";

const getProductById = async(req,res)=>{
    //fetches ID from request parameters
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        //checks for validity of the id
        return res.status(400).json({error: "Invalid ID format"});
    }
    // fetches the product details if id is valid & exists
    const product = await Product.findById(id);
    if(!product){
        //sends 404 error if product not found
        return res.status(404).json({message:"Product not found"});
    }
    return res.json(product);
}

export {getProductById}