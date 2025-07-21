import { Expense } from '../models/Expense';
import { User, UserRole } from '../models/User';
import { sequelize } from '../config/database';
import { QueryTypes } from 'sequelize';

export class AnalyticsService {
  async getExpenseAnalytics(userId: number, userRole: UserRole, filters: any) {
    const { startDate, endDate, groupBy } = filters;
    
    let whereCondition = '';
    let params: any = {};
    
    // Role-based filtering
    if (userRole === UserRole.EMPLOYEE) {
      whereCondition = 'WHERE e.userId = :userId';
      params.userId = userId;
    } else {
      whereCondition = 'WHERE 1=1';
    }
    
    if (startDate) {
      whereCondition += ' AND e.expenseDate >= :startDate';
      params.startDate = startDate;
    }
    
    if (endDate) {
      whereCondition += ' AND e.expenseDate <= :endDate';
      params.endDate = endDate;
    }

    // Group by month, week, or day
    let dateFormat = '%Y-%m';
    if (groupBy === 'week') dateFormat = '%Y-%u';
    if (groupBy === 'day') dateFormat = '%Y-%m-%d';

    const query = `
      SELECT 
        DATE_FORMAT(e.expenseDate, '${dateFormat}') as period,
        e.category,
        e.status,
        COUNT(*) as count,
        SUM(e.amount) as totalAmount,
        AVG(e.amount) as avgAmount
      FROM expenses e
      ${whereCondition}
      GROUP BY period, e.category, e.status
      ORDER BY period DESC
    `;

    const result = await sequelize.query(query, {
      replacements: params,
      type: QueryTypes.SELECT
    });

    return {
      analytics: result,
      summary: {
        totalExpenses: result.length,
        dateRange: { startDate, endDate },
        groupBy
      }
    };
  }

  async getDashboardStats(userId: number, userRole: UserRole) {
    let whereCondition = '';
    let params: any = {};
    
    if (userRole === UserRole.EMPLOYEE) {
      whereCondition = 'WHERE userId = :userId';
      params.userId = userId;
    }

    const totalExpensesQuery = `
      SELECT 
        COUNT(*) as totalExpenses,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingExpenses,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approvedExpenses,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejectedExpenses,
        SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) as totalApprovedAmount,
        SUM(amount) as totalAmount
      FROM expenses
      ${whereCondition}
    `;

    const categoryStatsQuery = `
      SELECT 
        category,
        COUNT(*) as count,
        SUM(amount) as totalAmount
      FROM expenses
      ${whereCondition}
      GROUP BY category
      ORDER BY totalAmount DESC
    `;

    const [totalStats] = await sequelize.query(totalExpensesQuery, {
      replacements: params,
      type: QueryTypes.SELECT
    });
    
    const categoryStats = await sequelize.query(categoryStatsQuery, {
      replacements: params,
      type: QueryTypes.SELECT
    });

    return {
      totalStats,
      categoryStats
    };
  }
}