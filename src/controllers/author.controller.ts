import { Request, Response, NextFunction } from 'express';
import { Author, Book } from '../models';
import { ResponseHelper } from '../helpers';
import { AppError } from '../helpers/error.helper';

export class AuthorController {
  /**
   * Add a new author
   */
  static async addAuthor(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, bio } = req.body;
      const author = await Author.create({ name, bio });
      return ResponseHelper.success(res, author, 'Author added successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an author
   */
  static async updateAuthor(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const updates = req.body;

      const author = await Author.findByPk(id);
      if (!author) {
        throw new AppError('Author not found', 404);
      }

      await author.update(updates);
      return ResponseHelper.success(res, author, 'Author updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete an author
   */
  static async deleteAuthor(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const author = await Author.findByPk(id);
      if (!author) {
        throw new AppError('Author not found', 404);
      }

      // Check if author has books
      const booksCount = await Book.count({ where: { author_id: id } });
      if (booksCount > 0) {
        throw new AppError(`Cannot delete author ${author.name} with associated ${booksCount} books.`, 400);
      }

      await author.destroy();
      return ResponseHelper.success(res, null, 'Author deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * List all authors
   */
  static async listAuthors(req: Request, res: Response, next: NextFunction) {
    try {
      const authors = await Author.findAll();
      if(authors.length === 0) {
        throw new AppError('No authors found', 404);
      }
      return ResponseHelper.success(res, authors, 'Authors retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get author by ID
   */
  static async getAuthor(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const author = await Author.findByPk(id, {
        include: [{ model: Book, as: 'books' }]
      });
      if (!author) {
        throw new AppError('Author not found', 404);
      }
      return ResponseHelper.success(res, author, 'Author retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
