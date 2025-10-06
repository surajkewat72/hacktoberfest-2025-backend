import express from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import dbConnection from '../scripts/dbConfig.js';
import errorHandler from './middleware/error-handler.middleware.js';
import notFound from './middleware/notFound.middleware.js'
const app = express();

dbConnection();
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Welcome to Homepage");
})

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Middleware
app.use(errorHandler);
//Middleware for not found 404
app.use(notFound);

export default app

