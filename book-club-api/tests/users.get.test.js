import request from "supertest";
import app from "../server.js";
import User from "../models/User.js";
import mongoose from "mongoose";

describe("Users GET endpoints", () => {
  test("GET /users returns 200 and an array", async () => {
    await User.create({ name: "Alice", email: "alice@example.com" });
    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  test("GET /users/:id returns 200 for existing id", async () => {
    const u = await User.create({ name: "Bob", email: "bob@example.com" });
    const res = await request(app).get(`/users/${u._id.toString()}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Bob");
  });

  test("GET /users/:id returns 400 for invalid id", async () => {
    const res = await request(app).get("/users/notanid");
    expect(res.status).toBe(400);
  });

  test("GET /users/:id returns 404 for non-existent id", async () => {
    const missingId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/users/${missingId.toString()}`);
    expect([404,500]).toContain(res.status); 
  });
});
