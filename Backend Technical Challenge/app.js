import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import usersPath from './routes/users';
import authPath from './routes/auth';
import brandRoutes from './routes/brands'; // Ensure the path is correct
import logger from './middlewares/logger';
import { notFound, errorHandler } from './middlewares/error';

dotenv.config();

const app = express();

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || '';
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('Connected to MongoDB...'))
  .catch((error) => console.error('Connection to MongoDB failed!', error));

// Middlewares
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/users', usersPath);
app.use('/api/auth', authPath);
app.use('/api/brands', brandRoutes);

// Error Handler Middleware
app.use(notFound);
app.use(errorHandler);

// Running the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
