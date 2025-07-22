import { Request, Response } from 'express';
import { ExpenseService } from '../services/expense.service';
import { validate } from 'class-validator';
import { CreateExpenseDto, UpdateExpenseStatusDto } from '../validators/expense.validator';

export class ExpenseController {
  private expenseService = new ExpenseService();

  async createExpense(req: Request, res: Response) {
    try {
      const createExpenseDto = Object.assign(new CreateExpenseDto(), req.body);
      const errors = await validate(createExpenseDto);
      
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const expense = await this.expenseService.createExpense(createExpenseDto, req.user.id);
      res.status(201).json(expense);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'An unexpected error occurred' });
      }
    }
  }

  async getExpenses(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, status, category, date } = req.query;
      const expenses = await this.expenseService.getExpenses(
        req.user.id,
        req.user.role,
        {
          page: Number(page),
          limit: Number(limit),
          status: status as string,
          category: category as string,
          date: date as string
        }
      );
      res.json(expenses);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'An unexpected error occurred' });
      }
    }
  }

  async approveRejectExpense(req: Request, res: Response) {
    try {
      const updateDto = Object.assign(new UpdateExpenseStatusDto(), req.body);
      const errors = await validate(updateDto);
      
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const expense = await this.expenseService.updateExpenseStatus(
        updateDto,
        req.user.id,
        req.user.role
      );
      res.json(expense);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'An unexpected error occurred' });
      }
    }
  }
}