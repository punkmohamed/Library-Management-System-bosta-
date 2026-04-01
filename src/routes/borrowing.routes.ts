import { Router } from 'express';
import { BorrowingController } from '../controllers/borrowing.controller';
import { validate, checkoutRateLimiter } from '../middleware';
import { authenticate } from '../middleware/auth.middleware';
import { checkoutValidation, returnValidation, checkCurrentBorrowingsValidation, listOverdueBooksValidation } from '../validators';

const router = Router();

// Protect all routes
router.use(authenticate);

/**
 * @route POST /api/v1/borrowing/checkout
 * @desc Borrower checks out a book
 * @access Private
 */
router.post('/checkout', checkoutRateLimiter, checkoutValidation, validate, BorrowingController.checkout);

/**
 * @route POST /api/v1/borrowing/return
 * @desc Borrower returns a book
 * @access Private
 */
router.post('/return', returnValidation, validate, BorrowingController.returnBook);

/**
 * @route GET /api/v1/borrowing/current/:user_id
 * @desc List books currently borrowed by a specific user
 * @access Private
 */
router.get('/current/:user_id', checkCurrentBorrowingsValidation, validate, BorrowingController.currentBorrowings);

/**
 * @route GET /api/v1/borrowing/overdue
 * @desc List books that are overdue
 * @access Private
 */
router.get('/overdue', listOverdueBooksValidation, validate, BorrowingController.listOverdue);

export default router;
