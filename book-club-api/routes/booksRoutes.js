import { Router } from "express";
import { body, param, query } from "express-validator";
import { runValidation } from "../middleware/validate.js";
import { listBooks, getBook, createBook, updateBook, deleteBook } from "../controllers/booksController.js";

/**
 * @openapi
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required: [title, author]
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *           example: The Pragmatic Programmer
 *         author:
 *           type: string
 *           example: Andrew Hunt, David Thomas
 *         genre:
 *           type: string
 *           example: Software Engineering
 *         summary:
 *           type: string
 *           example: A guide to pragmatic software craftsmanship.
 *         publishedYear:
 *           type: integer
 *           example: 1999
 *         ISBN:
 *           type: string
 *           example: 978-0201616224
 *         coverImage:
 *           type: string
 *           format: uri
 *           example: https://example.com/covers/pragmatic.jpg
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["nonfiction","software","classic"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ValidationErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Validation error
 *         errors:
 *           type: array
 *           description: List of validation issues
 *           items:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *                 example: "title must not be empty"
 *               param:
 *                 type: string
 *                 example: "title"
 *               location:
 *                 type: string
 *                 example: "body"
 *     ServerErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Internal server error
 *         details:
 *           type: string
 *           example: "Unexpected database error"
 */

/**
 * @openapi
 * /books:
 *   get:
 *     tags: [Books]
 *     summary: List books
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Case-insensitive title search
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [title, author, publishedYear, createdAt]
 *     responses:
 *       200:
 *         description: Array of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       400:
 *         description: Bad request (invalid query parameters)
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
 *   post:
 *     tags: [Books]
 *     summary: Create a new book
 *     parameters:
 *       - in: query
 *         name: forceError
 *         required: false
 *         description: Set to "true" to trigger a 500 error 
 *         schema:
 *           type: string
 *           enum: [true]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, author]
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               genre:
 *                 type: string
 *               publishedYear:
 *                 type: integer
 *               ISBN:
 *                 type: string
 *               summary:
 *                 type: string
 *               coverImage:
 *                 type: string
 *                 format: uri
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Bad request (invalid body)
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

/**
 * @openapi
 * /books/{bookId}:
 *   get:
 *     tags: [Books]
 *     summary: Get a book by ID
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *           example: 64b5d2fbcf1c8b0012a1a456
 *     responses:
 *       200:
 *         description: Book found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Bad request (invalid bookId)
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
 *     summary: Update a book
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *           example: 64b5d2fbcf1c8b0012a1a456
 *       - in: query
 *         name: forceError
 *         required: false
 *         description: Set to "true" to trigger a 500 error
 *         schema:
 *           type: string
 *           enum: [true]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               genre:
 *                 type: string
 *               publishedYear:
 *                 type: integer
 *               summary:
 *                 type: string
 *               coverImage:
 *                 type: string
 *                 format: uri
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Updated book
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Bad request (invalid path/body)
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
 *           example: 64b5d2fbcf1c8b0012a1a456
 *     responses:
 *       200:
 *         description: Book deleted
 *       400:
 *         description: Bad request (invalid bookId)
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

const router = Router();

const forceError = (req, res, next) => {
  if (req.query.forceError === "true") return next(new Error("Forced error for testing 500"));
  next();
};

router.get(
  "/",
  [
    query("sort").optional().isIn(["title","author","publishedYear","createdAt"]),
    query("search").optional().isString()
  ],
  runValidation,
  listBooks
);

router.get(
  "/:bookId",
  [ param("bookId").isMongoId() ],
  runValidation,
  getBook
);

router.post(
  "/",
  [
    forceError,
    body("_id").not().exists().withMessage("_id is not allowed on create"),
    body("title").isString().trim().notEmpty(),
    body("author").isString().trim().notEmpty(),
    body("publishedYear").optional().isInt({ min: 0 }),
    body("ISBN").optional().isString(),
    body("summary").optional().isString().isLength({ max: 1000 }),
    body("coverImage").optional().isURL(),
    body("tags").optional().isArray()
  ],
  runValidation,
  createBook
);

router.put(
  "/:bookId",
  [
    forceError,
    param("bookId").isMongoId(),
    body("_id").not().exists().withMessage("_id cannot be updated"),
    body("title").optional().isString().trim().notEmpty(),
    body("author").optional().isString().trim().notEmpty(),
    body("publishedYear").optional().isInt({ min: 0 }),
    body("ISBN").optional().isString(),
    body("summary").optional().isString().isLength({ max: 1000 }),
    body("coverImage").optional().isURL(),
    body("tags").optional().isArray()
  ],
  runValidation,
  updateBook
);

router.delete(
  "/:bookId",
  [ param("bookId").isMongoId() ],
  runValidation,
  deleteBook
);

export default router;
