/**
 * @swagger
 * components:
 *   schemas:
 *     BorrowRecord:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         user_id:
 *           type: string
 *           format: uuid
 *         book_id:
 *           type: string
 *           format: uuid
 *         borrow_date:
 *           type: string
 *           format: date-time
 *         due_date:
 *           type: string
 *           format: date-time
 *         return_date:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [BORROWED, RETURNED, OVERDUE]
 *         book:
 *           $ref: '#/components/schemas/Book'
 * 
 * /borrowing/checkout:
 *   post:
 *     summary: Borrower checks out a book
 *     tags: [Borrowing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - book_id
 *               - due_date
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *               book_id:
 *                 type: string
 *                 format: uuid
 *               due_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Book checked out successfully
 *       400:
 *         description: Validation error or book not available
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User or book not found
 * 
 * /borrowing/return:
 *   post:
 *     summary: Borrower returns a book
 *     tags: [Borrowing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - book_id
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *               book_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No active borrowing record found
 * 
 * /borrowing/current/{user_id}:
 *   get:
 *     summary: List books currently borrowed by a specific user
 *     tags: [Borrowing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Current borrowings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BorrowRecord'
 *       401:
 *         description: Unauthorized
 * 
 * /borrowing/overdue:
 *   get:
 *     summary: List books that are overdue
 *     tags: [Borrowing]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overdue books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BorrowRecord'
 *       401:
 *         description: Unauthorized
 */
