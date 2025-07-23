import express from 'express';
import { connectDatabase } from './config/database';
import authRoutes from './routes/auth.routes';
import expenseRoutes from './routes/expense.routes';
import analyticsRoutes from './routes/analytics.routes';
import { errorHandler } from './middleware/errorHandler';
import { corsMiddleware } from './middleware/cors';


import './models/User';
import './models/Expense';

const app = express();
const PORT = process.env.PORT || 3000;
// 
// Middleware
app.use(express.json());
app.use(corsMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use(errorHandler);

// Database connection and server start
// 0.0.0.0 is a special IP address that means
// bind to all available network interfaces " on the host machine.
connectDatabase()
  .then(() => {
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

export default app;