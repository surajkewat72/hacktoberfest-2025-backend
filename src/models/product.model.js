import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String },
  flavors: { type: [String] },
  sale: { type: Number, default: 0 },
  sizes: { type: [String] },
  new: { type: Boolean, default: false },
  description: { type: String },
  image: { type: String },
},
{
    timestamps: true,
    versionKey: false,
  });

const Product = mongoose.model('Product', productSchema);



export default Product;