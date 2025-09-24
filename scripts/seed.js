// scripts/seed.js
import mongoose from "mongoose";
import "dotenv/config";
import Product from "../src/models/product.model.js";
import { readFile } from "fs/promises";
import path from "path";

if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing. Please create a .env file based on .env.example and set your MongoDB connection string.");
  process.exit(1);
}

async function getSeedProducts() {
  const filePath = path.resolve("scripts/db/products.json");
  try {
    const data = await readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("❌ Failed to read products.json", err);
    process.exit(1);
  }
}

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const seedProducts = await getSeedProducts();
    await Product.deleteMany();
    await Product.insertMany(seedProducts);
    console.log("✅ Seed data inserted");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding DB", err);
    process.exit(1);
  }
}

seedDB();
