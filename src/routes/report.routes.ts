import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route GET /api/v1/reports/overdue
 * @desc Export all overdue borrows of the last month as CSV
 * @access Private
 */
router.get('/overdue', authenticate, ReportController.exportOverdueReport);

/**
 * @route GET /api/v1/reports/borrowings
 * @desc Export all borrowing processes of the last month as CSV
 * @access Private
 */
router.get('/borrowings', authenticate, ReportController.exportBorrowingsReport);

export default router;
