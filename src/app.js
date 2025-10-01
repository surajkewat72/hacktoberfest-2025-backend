import express from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes.js';
import seedDB from '../scripts/seed.js';

const app = express();

seedDB();
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Welcome to Homepage");
})
app.use('/api',productRoutes);
export default app

