import express from 'express';
import cors from 'cors';
import passport from './config/passport.config.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import collectionRoutes from './routes/collection.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import testRoutes from './routes/test.routes.js';
import authRoutes from './routes/auth.routes.js';
import errorHandler from './middleware/error-handler.middleware.js';
import notFound from './middleware/notFound.middleware.js'
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Initialize Passport
app.use(passport.initialize());

app.get('/',(req,res)=>{
    res.send("Welcome to Homepage");
})

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/test', testRoutes);
app.use('/auth', authRoutes);

// Middleware for not found 404
app.use(notFound);
// Global error handler (should be last)
app.use(errorHandler);

export default app

