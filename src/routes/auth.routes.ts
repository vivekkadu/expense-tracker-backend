import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

// Endpoint 1: Authentication
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.get('/profile', authenticateToken, authController.getProfile.bind(authController));

export default router;