import { Request, Response, NextFunction } from 'express';
import { Book, Author, sequelize, BorrowRecord } from '../models';
import { ResponseHelper } from '../helpers';
import { AppError } from '../helpers/error.helper';
import { Op } from 'sequelize';

export class BookController {
  /**
   * Add a new book
   */
  static async addBook(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, author_id, isbn, total_copies, shelf_location } = req.body;

      // Check if author exists
      const author = await Author.findByPk(author_id);
      if (!author) {
        throw new AppError('Author not found', 404);
      }

      // Check if ISBN already exists
      const existingBook = await Book.findOne({ where: { isbn } });
      if (existingBook) {
        throw new AppError('Book with this ISBN already exists', 409);
      }

      const book = await Book.create({
        title,
        author_id,
        isbn,
        total_copies,
        available_copies: total_copies,
        shelf_location,
      });

      return ResponseHelper.success(res, book, 'Book added successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update book details
   */
  static async updateBook(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { author_id, ...updates } = req.body;

      const book = await Book.findByPk(id);
      if (!book) {
        throw new AppError('Book not found', 404);
      }

      if (author_id) {
        throw new AppError('Author cannot be updated', 400);
      }

      // If updating total_copies, adjust available_copies
      if (updates.total_copies !== undefined) {
        const diff = updates.total_copies - book.total_copies;
        updates.available_copies = book.available_copies + diff;
        if (updates.available_copies < 0) {
          throw new AppError('Cannot reduce total copies below current borrowed count', 400);
        }
      }

      await book.update(updates);

      return ResponseHelper.success(res, book, 'Book updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a book
   */
  static async deleteBook(req: Request, res: Response, next: NextFunction) {
    const transaction = await sequelize.transaction();
    try {
      const id = req.params.id as string;
      const book = await Book.findByPk(id, { transaction });
      if (!book) {
        throw new AppError('Book not found', 404);
      }
      
      if (book.available_copies !== book.total_copies) {
        throw new AppError('Book cannot be deleted while borrowed', 400);
      } 
      await book.destroy({ transaction });
      await BorrowRecord.destroy({ where: { book_id: id }, transaction })

      await transaction.commit();

      return ResponseHelper.success(res, null, 'Book deleted successfully');
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }

  /**
   * List all books (with optional search)
   */
  static async listBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req.query;
      const where: any = {};

      if (query) {
        where[Op.or] = [
          { title: { [Op.iLike]: `%${query}%` } },
          { isbn: { [Op.iLike]: `%${query}%` } },
          { '$author.name$': { [Op.iLike]: `%${query}%` } },
        ];
      }

      const books = await Book.findAll({
        where,
        include: [{ model: Author, as: 'author' }],
      });
      if(books.length === 0) {
        throw new AppError('No books found', 404);
      }
      return ResponseHelper.success(res, books, 'Books retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
