import { Router } from 'express';
import { AuthorController } from '../controllers/author.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { addAuthorValidation, updateAuthorValidation, deleteAuthorValidation, getAuthorValidation } from '../validators';

const router = Router();

/**
 * @route POST /api/v1/authors
 * @desc Add a new author
 * @access Private
 */
router.post('/', authenticate, addAuthorValidation, validate, AuthorController.addAuthor);

/**
 * @route PUT /api/v1/authors/:id
 * @desc Update an author
 * @access Private
 */
router.put('/:id', authenticate, updateAuthorValidation, validate, AuthorController.updateAuthor);

/**
 * @route DELETE /api/v1/authors/:id
 * @desc Delete an author
 * @access Private
 */
router.delete('/:id', authenticate, deleteAuthorValidation, validate, AuthorController.deleteAuthor);

/**
 * @route GET /api/v1/authors
 * @desc List all authors
 * @access Public
 */
router.get('/', AuthorController.listAuthors);

/**
 * @route GET /api/v1/authors/:id
 * @desc Get author by ID
 * @access Public
 */
router.get('/:id', getAuthorValidation, validate, AuthorController.getAuthor);

export default router;
