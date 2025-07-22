import { Expense, ExpenseStatus } from '../models/Expense';
import { User, UserRole } from '../models/User';
import { CreateExpenseDto, UpdateExpenseStatusDto } from '../validators/expense.validator';
import { Op } from 'sequelize';

export class ExpenseService {
  async createExpense(createExpenseDto: CreateExpenseDto, userId: number) {
    const expense = await Expense.create({
      ...createExpenseDto,
      expenseDate: new Date(createExpenseDto.expenseDate), // Convert string to Date
      userId,
      status: ExpenseStatus.PENDING
    });

    return expense;
  }

  async getExpenses(userId: number, userRole: UserRole, filters: any) {
    const { page, limit, status, category, startDate, endDate } = filters;
    const offset = (page - 1) * limit;

    let whereCondition: any = {};
    
    // Role-based filtering
    if (userRole === UserRole.EMPLOYEE) {
      whereCondition.userId = userId;
    }

    if (status) {
      whereCondition.status = status;
    }
    if (category) {
      whereCondition.category = category;
    }
    
    // Date filtering
    if (startDate || endDate) {
      whereCondition.expenseDate = {};
      if (startDate) {
        whereCondition.expenseDate[Op.gte] = startDate;
      }
      if (endDate) {
        whereCondition.expenseDate[Op.lte] = endDate;
      }
    }

    const { count, rows } = await Expense.findAndCountAll({
      where: whereCondition,
      include: [{
        model: User,
        as: 'user',
        attributes: { exclude: ['password'] }
      }],
      offset,
      limit,
      order: [['createdAt', 'DESC']]
    });

    return {
      expenses: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async updateExpenseStatus(
    updateDto: UpdateExpenseStatusDto,
    userId: number,
    userRole: UserRole
  ) {
    // Only admins can approve/reject expenses
    if (userRole === UserRole.EMPLOYEE) {
      throw new Error('Insufficient permissions to update expense status');
    }

    const expense = await Expense.findByPk(updateDto.expenseId, {
      include: [{
        model: User,
        as: 'user',
        attributes: { exclude: ['password'] }
      }]
    });

    if (!expense) {
      throw new Error('Expense not found');
    }

    await expense.update({
      status: updateDto.status,
      approvedBy: userId,
      rejectionReason: updateDto.status === ExpenseStatus.REJECTED ? updateDto.rejectionReason : undefined
    });

    return expense;
  }

  async getExpenseById(expenseId: number, userId: number, userRole: UserRole) {
    let whereCondition: any = { id: expenseId };
    
    // Employees can only see their own expenses
    if (userRole === UserRole.EMPLOYEE) {
      whereCondition.userId = userId;
    }

    const expense = await Expense.findOne({
      where: whereCondition,
      include: [{
        model: User,
        as: 'user',
        attributes: { exclude: ['password'] }
      }]
    });

    if (!expense) {
      throw new Error('Expense not found');
    }

    return expense;
  }
}