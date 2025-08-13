import mongoose from "mongoose";
import Book from "../models/Book.js";
import Review from "../models/Review.js";
import User from "../models/User.js";
import Meeting from "../models/Meeting.js";

async function waitForMongoReady(timeoutMs = 20000) {
  const start = Date.now();
  while (mongoose.connection.readyState !== 1) {
    if (Date.now() - start > timeoutMs) {
      throw new Error("Timed out waiting for MongoDB connection (readyState !== 1)");
    }
    await new Promise(r => setTimeout(r, 100));
  }
}

beforeAll(async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI must be set to your TEST database for jest");
  }
  await waitForMongoReady();
});

afterEach(async () => {
  await Promise.allSettled([
    Book.deleteMany({}),
    Review.deleteMany({}),
    User.deleteMany({}),
    Meeting.deleteMany({}),
  ]);
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});
