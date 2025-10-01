import express from 'express';
const router = express.Router();
import {getProductById} from '../controllers/product.controller.js';

router.get('/products/:id',getProductById);

export default router