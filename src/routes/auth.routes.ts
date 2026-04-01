import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { registerValidation, loginValidation, refreshTokenValidation, updateUserValidation, deleteUserValidation } from '../validators';

const router = Router();

/**
 * @route POST /api/v1/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', registerValidation, validate, AuthController.register);

/**
 * @route POST /api/v1/auth/login
 * @desc Login user and generate tokens
 * @access Public
 */
router.post('/login', loginValidation, validate, AuthController.login);

/**
 * @route POST /api/v1/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post('/refresh', refreshTokenValidation, validate, AuthController.refresh);

/**
 * @route GET /api/v1/auth/users
 * @desc List all users
 * @access Private
 */
router.get('/users', authenticate, AuthController.listUsers);

/**
 * @route PUT /api/v1/auth/users/:id
 * @desc Update a user
 * @access Private
 */
router.put('/users/:id', authenticate, updateUserValidation, validate, AuthController.updateUser);

/**
 * @route DELETE /api/v1/auth/users/:id
 * @desc Delete a user
 * @access Private
 */
router.delete('/users/:id', authenticate, deleteUserValidation, validate, AuthController.deleteUser);

export default router;
