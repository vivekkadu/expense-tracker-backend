import { Router } from 'express';
import { ExpenseController } from '../controllers/expense.controller';
import { authenticateToken } from '../middleware/auth';
import { requireRole } from '../middleware/roleAuth';
import { UserRole } from '../models/User';

const router = Router();
const expenseController = new ExpenseController();

router.use(authenticateToken);

// Endpoint 2: Create Expense
router.post('/', expenseController.createExpense.bind(expenseController));

// Endpoint 3: Get Expenses
router.get('/', expenseController.getExpenses.bind(expenseController));

// Endpoint 4: Approve/Reject Expenses
router.put('/status', 
  requireRole([UserRole.ADMIN]), 
  expenseController.approveRejectExpense.bind(expenseController)
);

export default router;