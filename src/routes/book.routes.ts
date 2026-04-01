import { Router } from 'express';
import { BookController } from '../controllers/book.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { addBookValidation, updateBookValidation, deleteBookValidation, listBooksValidation } from '../validators';

const router = Router();

/**
 * @route POST /api/v1/books
 * @desc Add a new book
 * @access Private
 */
router.post('/', authenticate, addBookValidation, validate, BookController.addBook);

/**
 * @route PUT /api/v1/books/:id
 * @desc Update a book
 * @access Private
 */
router.put('/:id', authenticate, updateBookValidation, validate, BookController.updateBook);

/**
 * @route DELETE /api/v1/books/:id
 * @desc Delete a book
 * @access Private
 */
router.delete('/:id', authenticate, deleteBookValidation, validate, BookController.deleteBook);

/**
 * @route GET /api/v1/books
 * @desc List all books (with optional search)
 * @access Public
 */
router.get('/', listBooksValidation, validate, BookController.listBooks);

export default router;
