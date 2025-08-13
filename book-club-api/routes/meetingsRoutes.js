import { Router } from "express";
import { body, param, query } from "express-validator";
import { runValidation } from "../middleware/validate.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { listMeetings, getMeeting, createMeeting, updateMeeting, deleteMeeting } from "../controllers/meetingsController.js";

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: connect.sid
 *   schemas:
 *     Meeting:
 *       type: object
 *       required: [title, bookId, organizerId, startsAt]
 *       properties:
 *         _id: { type: string }
 *         title: { type: string, example: "August Book Club" }
 *         bookId: { type: string, example: "64b5d2fbcf1c8b0012a1a456" }
 *         organizerId: { type: string, example: "64b5d2fbcf1c8b0012a1b999" }
 *         startsAt: { type: string, format: date-time, example: "2025-09-01T18:00:00.000Z" }
 *         isOnline: { type: boolean, example: true }
 *         meetingUrl: { type: string, format: uri, example: "https://meet.example.com/abc" }
 *         location: { type: string, example: "Library, Room 2" }
 *         notes: { type: string, example: "Bring snacks" }
 *         attendees:
 *           type: array
 *           items: { type: string }
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
 *     ServerErrorResponse:
 *       type: object
 *       properties:
 *         message: { type: string, example: Internal server error }
 *         details: { type: string, example: Unexpected database error }
 */

/**
 * @openapi
 * /meetings:
 *   get:
 *     tags: [Meetings]
 *     summary: List meetings
 *     parameters:
 *       - in: query
 *         name: bookId
 *         schema: { type: string }
 *       - in: query
 *         name: organizerId
 *         schema: { type: string }
 *       - in: query
 *         name: forceError
 *         schema: { type: boolean }
 *         description: Set to "true" to trigger a 500 error
 *     responses:
 *       200:
 *         description: Array of meetings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Meeting' }
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
 *   post:
 *     tags: [Meetings]
 *     summary: Create a meeting
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
 *             $ref: '#/components/schemas/Meeting'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Meeting' }
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
 */

/**
 * @openapi
 * /meetings/{meetingId}:
 *   get:
 *     tags: [Meetings]
 *     summary: Get a meeting by ID
 *     parameters:
 *       - in: path
 *         name: meetingId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: forceError
 *         schema: { type: boolean }
 *         description: Set to "true" to trigger a 500 error
 *     responses:
 *       200:
 *         description: Meeting found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Meeting' }
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
 *     tags: [Meetings]
 *     summary: Update a meeting
 *     security: [ { cookieAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: meetingId
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
 *             $ref: '#/components/schemas/Meeting'
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Meeting' }
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
 *   delete:
 *     tags: [Meetings]
 *     summary: Delete a meeting
 *     security: [ { cookieAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: meetingId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Meeting deleted
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
 */

const router = Router();

const forceError = (req, res, next) => {
  if (req.query.forceError === "true") return next(new Error("Forced error for testing 500"));
  next();
};

router.get(
  "/",
  [
    forceError,
    query("bookId").optional().isMongoId(),
    query("organizerId").optional().isMongoId()
  ],
  runValidation,
  listMeetings
);

router.get(
  "/:meetingId",
  [ forceError, param("meetingId").isMongoId() ],
  runValidation,
  getMeeting
);

router.post(
  "/",
  [
    forceError,
    body("_id").not().exists().withMessage("_id is not allowed on create"),
    body("title").isString().trim().notEmpty(),
    body("bookId").isMongoId(),
    body("organizerId").isMongoId(),
    body("startsAt").isISO8601(),
    body("isOnline").optional().isBoolean(),
    body("meetingUrl").optional().isURL(),
    body("location").optional().isString().isLength({ max: 200 }),
    body("notes").optional().isString().isLength({ max: 1000 }),
    body("attendees").optional().isArray()
  ],
  requireAuth,
  runValidation,
  createMeeting
);

router.put(
  "/:meetingId",
  [
    forceError,
    param("meetingId").isMongoId(),
    body("_id").not().exists().withMessage("_id cannot be updated"),
    body("title").optional().isString().trim().notEmpty(),
    body("bookId").optional().isMongoId(),
    body("organizerId").optional().isMongoId(),
    body("startsAt").optional().isISO8601(),
    body("isOnline").optional().isBoolean(),
    body("meetingUrl").optional().isURL(),
    body("location").optional().isString().isLength({ max: 200 }),
    body("notes").optional().isString().isLength({ max: 1000 }),
    body("attendees").optional().isArray()
  ],
  requireAuth,
  runValidation,
  updateMeeting
);

router.delete(
  "/:meetingId",
  [ param("meetingId").isMongoId() ],
  requireAuth,
  runValidation,
  deleteMeeting
);

export default router;
