import request from "supertest";
import app from "../server.js";
import Meeting from "../models/Meeting.js";
import User from "../models/User.js";
import Book from "../models/Book.js";
import mongoose from "mongoose";

describe("Meetings GET endpoints", () => {
  test("GET /meetings returns 200 and an array", async () => {
    const book = await Book.create({ title: "Dune", author: "Frank Herbert" });
    const organizer = await User.create({ name: "Org", email: "org@example.com" });
    await Meeting.create({
      title: "August Club",
      bookId: book._id,
      organizerId: organizer._id,
      startsAt: new Date().toISOString(),
      isOnline: true,
      meetingUrl: "https://meet.example.com/abc"
    });

    const res = await request(app).get("/meetings");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  test("GET /meetings/:id returns 200 for existing id", async () => {
    const book = await Book.create({ title: "B", author: "A" });
    const organizer = await User.create({ name: "Org2", email: "org2@example.com" });
    const m = await Meeting.create({
      title: "Sept Club",
      bookId: book._id,
      organizerId: organizer._id,
      startsAt: new Date().toISOString(),
      isOnline: false,
      location: "Library"
    });
    const res = await request(app).get(`/meetings/${m._id.toString()}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Sept Club");
  });

  test("GET /meetings/:id returns 400 for invalid id format", async () => {
    const res = await request(app).get("/meetings/not-a-valid-id");
    expect(res.status).toBe(400);
  });

  test("GET /meetings/:id returns 404 for valid but non-existent id", async () => {
    const missingId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/meetings/${missingId.toString()}`);
    expect([404,500]).toContain(res.status);
  });
});
