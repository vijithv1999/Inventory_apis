import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import db from "./configs/db.js";
import userRoutes from './routes/user.routes.js';
import StockRoutes from './routes/stocks.routes.js'
import invoiceRouter from './routes/routes.invoices.js';

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, Express server is up and running!');
});

app.use('/api/user', userRoutes);
app.use('/api/stock', StockRoutes)
app.use('/api/invoice', invoiceRouter)

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app
