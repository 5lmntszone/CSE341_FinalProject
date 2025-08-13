import { Router } from "express";
import { body, param } from "express-validator";
import { runValidation } from "../middleware/validate.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { listUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/usersController.js";

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: connect.sid
 *   schemas:
 *     User:
 *       type: object
 *       required: [name, email]
 *       properties:
 *         _id: { type: string }
 *         name: { type: string, example: "Barbara Doe" }
 *         email: { type: string, example: "barbara@example.com" }
 *         role: { type: string, enum: [member, admin], example: "member" }
 *         bio: { type: string, example: "Avid reader" }
 *         avatar: { type: string, format: uri, example: "https://example.com/a.jpg" }
 *         joinedAt: { type: string, format: date-time }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *     ValidationErrorResponse:
 *       type: object
 *       properties:
 *         message: { type: string, example: Validation error }
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               msg: { type: string }
 *               param: { type: string }
 *               location: { type: string }
 *     UnauthorizedResponse:
 *       type: object
 *       properties:
 *         message: { type: string, example: Not authenticated }
 *     ServerErrorResponse:
 *       type: object
 *       properties:
 *         message: { type: string, example: Internal server error }
 *         details: { type: string, example: Unexpected database error }
 */

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: List users
 *     parameters:
 *       - in: query
 *         name: forceError
 *         schema: { type: boolean }
 *         description: Set to "true" to trigger a 500 error
 *     responses:
 *       200:
 *         description: Array of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/User' }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ServerErrorResponse' }
 *   post:
 *     tags: [Users]
 *     summary: Create a user
 *     security: [ { cookieAuth: [] } ]
 *     parameters:
 *       - in: query
 *         name: forceError
 *         schema: { type: boolean }
 *         description: Set to "true" to trigger a 500 error
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               role: { type: string, enum: [member, admin] }
 *               bio: { type: string }
 *               avatar: { type: string, format: uri }
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationErrorResponse' }
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UnauthorizedResponse' }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ServerErrorResponse' }
 */

/**
 * @openapi
 * /users/{userId}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: forceError
 *         schema: { type: boolean }
 *         description: Set to "true" to trigger a 500 error
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationErrorResponse' }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ServerErrorResponse' }
 *   put:
 *     tags: [Users]
 *     summary: Update a user
 *     security: [ { cookieAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: forceError
 *         schema: { type: boolean }
 *         description: Set to "true" to trigger a 500 error
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               role: { type: string, enum: [member, admin] }
 *               bio: { type: string }
 *               avatar: { type: string, format: uri }
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationErrorResponse' }
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UnauthorizedResponse' }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ServerErrorResponse' }
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user
 *     security: [ { cookieAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User deleted
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationErrorResponse' }
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UnauthorizedResponse' }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ServerErrorResponse' }
 */

const router = Router();

const forceError = (req, res, next) => {
  if (req.query.forceError === "true") return next(new Error("Forced error for testing 500"));
  next();
};

router.get("/", [forceError], listUsers);

router.get("/:userId", [forceError, param("userId").isMongoId()], runValidation, getUser);

router.post(
  "/",
  [
    forceError,
    body("_id").not().exists().withMessage("_id is not allowed on create"),
    body("name").isString().trim().notEmpty(),
    body("email").isEmail().normalizeEmail(),
    body("role").optional().isIn(["member", "admin"]),
    body("bio").optional().isString().isLength({ max: 500 }),
    body("avatar").optional().isURL()
  ],
  requireAuth,
  runValidation,
  createUser
);

router.put(
  "/:userId",
  [
    forceError,
    param("userId").isMongoId(),
    body("_id").not().exists().withMessage("_id cannot be updated"),
    body("name").optional().isString().trim().notEmpty(),
    body("email").optional().isEmail().normalizeEmail(),
    body("role").optional().isIn(["member", "admin"]),
    body("bio").optional().isString().isLength({ max: 500 }),
    body("avatar").optional().isURL()
  ],
  requireAuth,
  runValidation,
  updateUser
);

router.delete("/:userId", [param("userId").isMongoId()], requireAuth, runValidation, deleteUser);

export default router;
