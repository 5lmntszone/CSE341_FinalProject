import Meeting from "../models/Meeting.js";
import Book from "../models/Book.js";
import User from "../models/User.js";

export const listMeetings = async (req, res, next) => {
  try {
    if (req.query.forceError === "true") throw new Error("Forced 500 error for testing");
    const { bookId, organizerId } = req.query;
    const q = {};
    if (bookId) q.bookId = bookId;
    if (organizerId) q.organizerId = organizerId;
    const meetings = await Meeting.find(q).sort({ startsAt: 1 });
    res.json(meetings);
  } catch (e) { next(e); }
};

export const getMeeting = async (req, res, next) => {
  try {
    if (req.query.forceError === "true") throw new Error("Forced 500 error for testing");
    const meeting = await Meeting.findById(req.params.meetingId);
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });
    res.json(meeting);
  } catch (e) { next(e); }
};

export const createMeeting = async (req, res, next) => {
  try {
    if (req.query.forceError === "true") throw new Error("Forced 500 error for testing");
    if ("_id" in req.body) delete req.body._id;

    const { bookId, organizerId, isOnline, meetingUrl, location, attendees } = req.body;

    const bookExists = await Book.exists({ _id: bookId });
    if (!bookExists) {
      return res.status(400).json({
        message: "Validation error",
        errors: [{ msg: "bookId does not reference an existing book", param: "bookId", location: "body" }]
      });
    }
    const organizerExists = await User.exists({ _id: organizerId });
    if (!organizerExists) {
      return res.status(400).json({
        message: "Validation error",
        errors: [{ msg: "organizerId does not reference an existing user", param: "organizerId", location: "body" }]
      });
    }

    if (isOnline) {
      if (!meetingUrl) {
        return res.status(400).json({
          message: "Validation error",
          errors: [{ msg: "meetingUrl is required when isOnline is true", param: "meetingUrl", location: "body" }]
        });
      }
    } else {
      if (!location) {
        return res.status(400).json({
          message: "Validation error",
          errors: [{ msg: "location is required when isOnline is false", param: "location", location: "body" }]
        });
      }
    }

    if (Array.isArray(attendees) && attendees.length > 0) {
      const count = await User.countDocuments({ _id: { $in: attendees } });
      if (count !== attendees.length) {
        return res.status(400).json({
          message: "Validation error",
          errors: [{ msg: "One or more attendees do not reference existing users", param: "attendees", location: "body" }]
        });
      }
    }

    const meeting = await Meeting.create(req.body);
    res.status(201).json(meeting);
  } catch (e) { next(e); }
};

export const updateMeeting = async (req, res, next) => {
  try {
    if (req.query.forceError === "true") throw new Error("Forced 500 error for testing");

    const updates = req.body;
    if (updates.bookId) {
      const exists = await Book.exists({ _id: updates.bookId });
      if (!exists) {
        return res.status(400).json({
          message: "Validation error",
          errors: [{ msg: "bookId does not reference an existing book", param: "bookId", location: "body" }]
        });
      }
    }
    if (updates.organizerId) {
      const exists = await User.exists({ _id: updates.organizerId });
      if (!exists) {
        return res.status(400).json({
          message: "Validation error",
          errors: [{ msg: "organizerId does not reference an existing user", param: "organizerId", location: "body" }]
        });
      }
    }

    if (typeof updates.isOnline === "boolean") {
      if (updates.isOnline && !updates.meetingUrl) {
        return res.status(400).json({
          message: "Validation error",
          errors: [{ msg: "meetingUrl is required when isOnline is true", param: "meetingUrl", location: "body" }]
        });
      }
      if (!updates.isOnline && !updates.location) {
        return res.status(400).json({
          message: "Validation error",
          errors: [{ msg: "location is required when isOnline is false", param: "location", location: "body" }]
        });
      }
    }

    if (updates.attendees) {
      if (!Array.isArray(updates.attendees)) {
        return res.status(400).json({
          message: "Validation error",
          errors: [{ msg: "attendees must be an array of user IDs", param: "attendees", location: "body" }]
        });
      }
      const count = await User.countDocuments({ _id: { $in: updates.attendees } });
      if (count !== updates.attendees.length) {
        return res.status(400).json({
          message: "Validation error",
          errors: [{ msg: "One or more attendees do not reference existing users", param: "attendees", location: "body" }]
        });
      }
    }

    const meeting = await Meeting.findByIdAndUpdate(
      req.params.meetingId,
      updates,
      { new: true, runValidators: true }
    );
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });
    res.json(meeting);
  } catch (e) { next(e); }
};

export const deleteMeeting = async (req, res, next) => {
  try {
    if (req.query.forceError === "true") throw new Error("Forced 500 error for testing");
    const meeting = await Meeting.findByIdAndDelete(req.params.meetingId);
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });
    res.json({ message: "Meeting deleted" });
  } catch (e) { next(e); }
};
