const express = require("express");
const { body, param } = require("express-validator");
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const runValidation = require("../middleware/validation");

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         genre:
 *           type: string
 *         publishedYear:
 *           type: integer
 *         ISBN:
 *           type: string
 *         summary:
 *           type: string
 *         coverImage:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *     ValidationErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *               param:
 *                 type: string
 *               location:
 *                 type: string
 *     ServerErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

/**
 * @openapi
 * /books:
 *   get:
 *     tags: [Books]
 *     summary: Get all books
 *     responses:
 *       200:
 *         description: A list of books
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 *   post:
 *     tags: [Books]
 *     summary: Create a new book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/", getBooks);
router.post(
  "/",
  [
    body("_id").not().exists().withMessage("_id is not allowed on create"),
    body("title").isString().trim().notEmpty(),
    body("author").isString().trim().notEmpty(),
    body("genre").optional().isString(),
    body("publishedYear").optional().isInt({ min: 0 }),
    body("ISBN").optional().isString(),
    body("summary").optional().isString(),
    body("coverImage").optional().isString(),
    body("tags").optional().isArray(),
  ],
  runValidation,
  createBook
);

/**
 * @openapi
 * /books/{bookId}:
 *   get:
 *     tags: [Books]
 *     summary: Get book by ID
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book found
 *       400:
 *         description: Invalid ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 *   put:
 *     tags: [Books]
 *     summary: Update book by ID
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 *   delete:
 *     tags: [Books]
 *     summary: Delete a book
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted
 *       400:
 *         description: Invalid bookId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get("/:bookId", param("bookId").isMongoId(), runValidation, getBookById);
router.put(
  "/:bookId",
  [
    param("bookId").isMongoId(),
    body("title").optional().isString().trim().notEmpty(),
    body("author").optional().isString().trim().notEmpty(),
    body("genre").optional().isString(),
    body("publishedYear").optional().isInt({ min: 0 }),
    body("ISBN").optional().isString(),
    body("summary").optional().isString(),
    body("coverImage").optional().isString(),
    body("tags").optional().isArray(),
  ],
  runValidation,
  updateBook
);
router.delete("/:bookId", param("bookId").isMongoId(), runValidation, deleteBook);

module.exports = router;
