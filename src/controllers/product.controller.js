import mongoose from "mongoose";
import Product from "../models/product.model.js";

const getProductById = async(req,res)=>{
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "Invalid ID format"});
    }
    const product = await Product.findById(id);
    if(!product){
        return res.status(404).json({message:"Product not found"});
    }
    return res.json(product);
}

export {getProductById}