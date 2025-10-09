import express from 'express';
import { getCollectionProducts } from '../controllers/collection.controller.js';

const router = express.Router();

// GET /api/collections/:name
router.get('/:name', getCollectionProducts);

export default router;


