/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         author_id:
 *           type: string
 *           format: uuid
 *         isbn:
 *           type: string
 *         total_copies:
 *           type: integer
 *         available_copies:
 *           type: integer
 *         shelf_location:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         author:
 *           $ref: '#/components/schemas/Author'
 * 
 * /books:
 *   get:
 *     summary: List all books (with optional search)
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Search by title, author name, or ISBN
 *     responses:
 *       200:
 *         description: Books retrieved successfully
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
 *                     $ref: '#/components/schemas/Book'
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author_id
 *               - isbn
 *               - total_copies
 *             properties:
 *               title:
 *                 type: string
 *               author_id:
 *                 type: string
 *                 format: uuid
 *               isbn:
 *                 type: string
 *               total_copies:
 *                 type: integer
 *               shelf_location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Author not found
 *       409:
 *         description: ISBN already exists
 * 
 * /books/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               isbn:
 *                 type: string
 *               total_copies:
 *                 type: integer
 *               shelf_location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 */
