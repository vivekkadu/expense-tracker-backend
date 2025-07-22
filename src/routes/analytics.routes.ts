import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const analyticsController = new AnalyticsController();

router.use(authenticateToken);

// Endpoint 5: Get Analytics
router.get('/', analyticsController.getAnalytics.bind(analyticsController));

// Endpoint 6: Get Dashboard Stats
router.get('/dashboard', analyticsController.getDashboardStats.bind(analyticsController));

export default router;