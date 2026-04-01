import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../services/report.service';

export class ReportController {
  /**
   * Export all overdue borrows of the last month as CSV
   */
  static async exportOverdueReport(req: Request, res: Response, next: NextFunction) {
    try {
      const csv = await ReportService.exportOverdueLastMonth();
      
      const fileName = `overdue-borrows-last-month-${new Date().toISOString().split('T')[0]}.csv`;
      
      res.header('Content-Type', 'text/csv');
      res.attachment(fileName);
      return res.send(csv);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Export all borrowing processes of the last month as CSV
   */
  static async exportBorrowingsReport(req: Request, res: Response, next: NextFunction) {
    try {
      const csv = await ReportService.exportBorrowingsLastMonth();
      
      const fileName = `borrowing-report-last-month-${new Date().toISOString().split('T')[0]}.csv`;
      
      res.header('Content-Type', 'text/csv');
      res.attachment(fileName);
      return res.send(csv);
    } catch (error) {
      next(error);
    }
  }
}
