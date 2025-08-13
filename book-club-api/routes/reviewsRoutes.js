import { Router } from "express";
import { body, param, query } from "express-validator";
import { runValidation } from "../middleware/validate.js";
import { listReviews, createReview, deleteReview } from "../controllers/reviewsController.js";

/**
 * @openapi
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required: [bookId, userName, rating]
 *       properties:
 *         _id:
 *           type: string
 *         bookId:
 *           type: string
 *           example: 64b5d2fbcf1c8b0012a1a456
 *         userName:
 *           type: string
 *           example: barbara
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         comment:
 *           type: string
 *           example: "Loved the pacing and characters."
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
 *           items:
 *             type: object
 *             properties:
 *               msg: { type: string, example: "bookId must be a valid MongoId" }
 *               param: { type: string, example: "bookId" }
 *               location: { type: string, example: "body" }
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
 * /reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: List reviews (optionally filter by bookId)
 *     parameters:
 *       - in: query
 *         name: bookId
 *         schema:
 *           type: string
 *         description: Filter reviews for a specific book
 *     responses:
 *       200:
 *         description: Array of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
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
 *     tags: [Reviews]
 *     summary: Create a review
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
 *             required: [bookId, userName, rating]
 *             properties:
 *               bookId: { type: string }
 *               userName: { type: string }
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment: { type: string }
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
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
 * /reviews/{reviewId}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete a review
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted
 *       400:
 *         description: Bad request (invalid reviewId)
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
  [ query("bookId").optional().isMongoId() ],
  runValidation,
  listReviews
);

router.post(
  "/",
  [
    forceError,
    body("_id").not().exists().withMessage("_id is not allowed on create"),
    body("bookId").isMongoId(),
    body("userName").isString().trim().notEmpty(),
    body("rating").isInt({ min: 1, max: 5 }),
    body("comment").optional().isString().isLength({ max: 1000 })
  ],
  runValidation,
  createReview
);

router.delete(
  "/:reviewId",
  [ param("reviewId").isMongoId() ],
  runValidation,
  deleteReview
);

export default router;
