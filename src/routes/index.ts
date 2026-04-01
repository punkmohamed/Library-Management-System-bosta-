import { Router } from 'express';
import authRoutes from './auth.routes';
import bookRoutes from './book.routes';
import authorRoutes from './author.routes';
import borrowingRoutes from './borrowing.routes';
import reportRoutes from './report.routes';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
router.use('/authors', authorRoutes);
router.use('/borrowing', borrowingRoutes);
router.use('/reports', reportRoutes);

export default router;
