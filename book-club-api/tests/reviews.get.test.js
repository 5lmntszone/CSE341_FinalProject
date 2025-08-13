import request from "supertest";
import app from "../server.js";
import Book from "../models/Book.js";
import Review from "../models/Review.js";

describe("Reviews GET endpoints", () => {
  test("GET /reviews returns 200 and an array", async () => {
    const book = await Book.create({ title: "Dune", author: "Frank Herbert" });
    await Review.create({ bookId: book._id, userName: "barbara", rating: 5, comment: "Great!" });
    const res = await request(app).get("/reviews");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  test("GET /reviews?bookId=... filters by book", async () => {
    const b1 = await Book.create({ title: "B1", author: "A1" });
    const b2 = await Book.create({ title: "B2", author: "A2" });
    await Review.create({ bookId: b1._id, userName: "u1", rating: 4 });
    await Review.create({ bookId: b2._id, userName: "u2", rating: 5 });

    const res = await request(app).get(`/reviews`).query({ bookId: b1._id.toString() });
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].bookId).toBe(b1._id.toString());
  });

  test("GET /reviews?bookId=invalidId returns 400", async () => {
    const res = await request(app).get("/reviews").query({ bookId: "nope" });
    expect(res.status).toBe(400);
  });
});
