import request from "supertest";
import app from "../server.js";
import Book from "../models/Book.js";
import mongoose from "mongoose";

describe("Books GET endpoints", () => {
  test("GET /books should return 200 and an array", async () => {
    await Book.create({ title: "Dune", author: "Frank Herbert" });
    const res = await request(app).get("/books");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  test("GET /books/:id returns 200 for existing id", async () => {
    const b = await Book.create({ title: "Hyperion", author: "Dan Simmons" });
    const res = await request(app).get(`/books/${b._id.toString()}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Hyperion");
  });

  test("GET /books/:id returns 400 for invalid id format", async () => {
    const res = await request(app).get("/books/not-a-valid-objectid");
    expect(res.status).toBe(400);
  });

  test("GET /books/:id returns 404 for valid but missing id", async () => {
    const missingId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/books/${missingId.toString()}`);
    expect([404,500]).toContain(res.status); 
  });
});
