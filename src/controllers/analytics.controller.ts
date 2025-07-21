import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';

export class AnalyticsController {
  private analyticsService = new AnalyticsService();

  async getAnalytics(req: Request, res: Response) {
    try {
      const { startDate, endDate, groupBy = 'month' } = req.query;
      const analytics = await this.analyticsService.getExpenseAnalytics(
        req.user.id,
        req.user.role,
        {
          startDate: startDate as string,
          endDate: endDate as string,
          groupBy: groupBy as string
        }
      );
      res.json(analytics);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'An unknown error occurred' });
      }
    }
  }
}