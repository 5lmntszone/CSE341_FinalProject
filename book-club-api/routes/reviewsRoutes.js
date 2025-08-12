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
 *           example: 66b8a3c2b6dcb1a2f0b1cdef
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
 *           example: Loved the practical tips!
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: List reviews (optionally filter by book)
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
 *   post:
 *     tags: [Reviews]
 *     summary: Create a review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       422:
 *         description: Validation error
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
 *       404:
 *         description: Review not found
 */

const router = Router();

router.get(
  "/",
  [ query("bookId").optional().isMongoId() ],
  runValidation,
  listReviews
);

router.post(
  "/",
  [
    body("bookId").isMongoId(),
    body("userName").isString().trim().notEmpty(),
    body("rating").isInt({ min:1, max:5 }),
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
