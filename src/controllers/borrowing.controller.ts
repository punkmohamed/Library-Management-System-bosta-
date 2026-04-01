import { Request, Response, NextFunction } from 'express';
import { BorrowRecord, Book, User, sequelize } from '../models';
import { ResponseHelper } from '../helpers';
import { AppError } from '../helpers/error.helper';
import { Op } from 'sequelize';

export class BorrowingController {
  /**
   * Borrower checks out a book
   */
  static async checkout(req: Request, res: Response, next: NextFunction) {
    const transaction = await sequelize.transaction();
    try {
      const { user_id, book_id, due_date } = req.body;

      // Check if user exists
      const user = await User.findByPk(user_id);
      if (!user) {
        throw new AppError('Borrower not found', 404);
      }

      // Check if book exists and is available
      const book = await Book.findByPk(book_id, { transaction });
      if (!book) {
        throw new AppError('Book not found', 404);
      }

      if (book.available_copies <= 0) {
        throw new AppError('Book currently not available for checkout', 400);
      }

      // Check if user already has this book borrowed and not returned
      const existingBorrow = await BorrowRecord.findOne({
        where: {
          user_id,
          book_id,
          status: 'BORROWED',
        }
      });

      if (existingBorrow) {
        throw new AppError('You have already borrowed this book and not returned it yet', 400);
      }

      // Create borrow record
      const borrowRecord = await BorrowRecord.create(
        {
          user_id,
          book_id,
          borrow_date: new Date(),
          due_date: new Date(due_date),
          status: 'BORROWED',
        },
        { transaction }
      );

      // Decrement available copies
      await book.update(
        { available_copies: book.available_copies - 1 },
        { transaction }
      );

      await transaction.commit();

      return ResponseHelper.success(res, borrowRecord, 'Book checked out successfully', 201);
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }

  /**
   * Borrower returns a book
   */
  static async returnBook(req: Request, res: Response, next: NextFunction) {
    const transaction = await sequelize.transaction();
    try {
      const { user_id, book_id } = req.body;

      // Find active borrow record
      const borrowRecord = await BorrowRecord.findOne({
        where: {
          user_id,
          book_id,
          status: { [Op.or]: ['BORROWED', 'OVERDUE'] },
        },
        transaction,
      });

      if (!borrowRecord) {
        throw new AppError('No active borrowing record found for this user and book', 404);
      }

      // Update borrow record
      await borrowRecord.update(
        {
          return_date: new Date(),
          status: 'RETURNED',
        },
        { transaction }
      );

      // Increment available copies
      const book = await Book.findByPk(book_id, { transaction });
      if (book) {
        await book.update(
          { available_copies: book.available_copies + 1 },
          { transaction }
        );
      }

      await transaction.commit();

      return ResponseHelper.success(res, borrowRecord, 'Book returned successfully');
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }

  /**
   * List books currently borrowed by a specific user
   */
  static async currentBorrowings(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.params.user_id as string;

      const borrowRecords = await BorrowRecord.findAll({
        where: {
          user_id,
          status: { [Op.or]: ['BORROWED', 'OVERDUE'] },
        },
        include: [{ model: Book, as: 'book' }],
      });

      if(borrowRecords.length === 0) {
        throw new AppError('No current borrowings found', 404);
      }

      return ResponseHelper.success(res, borrowRecords, 'Current borrowings retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * List books that are overdue
   */
  static async listOverdue(req: Request, res: Response, next: NextFunction) {
    try {

      await BorrowRecord.update(
        { status: 'OVERDUE' },
        {
          where: {
            due_date: { [Op.lt]: new Date() },
            status: 'BORROWED',
          },
        }
      );
      
      const overdueRecords = await BorrowRecord.findAll({
        where: {
          due_date: { [Op.lt]: new Date() },
          status: 'OVERDUE',
        },
        include: [
          { model: Book, as: 'book' },
          { model: User, as: 'user', attributes: ['id', 'email', 'full_name'] },
        ],
      });

      if(overdueRecords.length === 0) {
        throw new AppError('No overdue books found', 404);
      }

      return ResponseHelper.success(res, overdueRecords, 'Overdue books retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
