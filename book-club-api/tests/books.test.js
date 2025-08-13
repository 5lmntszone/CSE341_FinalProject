// tests/books.routes.test.js
/**
 * Route-level tests for GET /books and GET /books/:bookId
 * - Uses a tiny in-test Express app (doesn't import server.js)
 * - Mocks the Book mongoose model (no real DB)
 * - Exercises validation, success, 404, and 500 paths
 */

import express from 'express';
import request from 'supertest';
import { jest } from '@jest/globals';

// --- Mock the Mongoose Book model used by the controller ---
const findMock = jest.fn();
const findByIdMock = jest.fn();

// ESM mock for ../models/Book.js
jest.unstable_mockModule('../models/Book.js', () => {
  return {
    default: {
      find: findMock,
      findById: findByIdMock,
    },
  };
});

// Import routes AFTER mocking the Book model
const { default: booksRoutes } = await import('../routes/booksRoutes.js');

// Helper to build a minimal app just for /books routes
const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/books', booksRoutes);

  // Minimal error handler (controller throws -> 500 here)
  // Your project has its own error middleware; for this unit test
  // we keep it tiny and stable.
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    res.status(500).json({ message: 'Internal server error' });
  });
  return app;
};

describe('Books routes', () => {
  let app;

  beforeEach(() => {
    app = buildApp();
    findMock.mockReset();
    findByIdMock.mockReset();
  });

  // ---------- GET /books ----------
  test('GET /books returns 200 and an array', async () => {
    // listBooks does: Book.find(q).sort(s)
    const sortSpy = jest.fn().mockResolvedValue([
      { _id: '1', title: 'A', author: 'X' },
      { _id: '2', title: 'B', author: 'Y' },
    ]);
    findMock.mockReturnValue({ sort: sortSpy });

    const res = await request(app).get('/books');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // default sort: createdAt: -1
    expect(findMock).toHaveBeenCalledWith({});
    expect(sortSpy).toHaveBeenCalledWith({ createdAt: -1 });
  });

  test('GET /books applies search (regex on title) and sort', async () => {
    const sortSpy = jest.fn().mockResolvedValue([{ _id: '3', title: 'Pragmatic', author: 'Hunt' }]);
    findMock.mockReturnValue({ sort: sortSpy });

    const res = await request(app).get('/books')
      .query({ search: 'prag', sort: 'title' });

    expect(res.status).toBe(200);

    // Ensure search query used case-insensitive regex
    const passedQuery = findMock.mock.calls[0][0];
    expect(passedQuery).toHaveProperty('title');
    expect(passedQuery.title).toBeInstanceOf(RegExp);
    expect(passedQuery.title.flags).toContain('i');

    // Ensure sort used correctly
    expect(sortSpy).toHaveBeenCalledWith({ title: 1 });
  });

  test('GET /books rejects invalid sort param with 400', async () => {
    const res = await request(app).get('/books').query({ sort: 'notAllowed' });
    expect(res.status).toBe(400);
    // Optional: check validation error shape if you want:
    // expect(res.body?.message).toBeDefined();
    // expect(Array.isArray(res.body?.errors)).toBe(true);
  });

  test('GET /books can trigger 500 via ?forceError=true', async () => {
    // Controller throws when req.query.forceError === "true"
    const res = await request(app).get('/books').query({ forceError: 'true' });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Internal server error' });
  });

  // ---------- GET /books/:bookId ----------
  test('GET /books/:bookId returns 200 and the book (when found)', async () => {
    findByIdMock.mockResolvedValue({ _id: '64b5d2fbcf1c8b0012a1a456', title: 'Dune', author: 'Herbert' });

    const res = await request(app).get('/books/64b5d2fbcf1c8b0012a1a456');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ title: 'Dune', author: 'Herbert' });
    expect(findByIdMock).toHaveBeenCalledWith('64b5d2fbcf1c8b0012a1a456');
  });

  test('GET /books/:bookId returns 404 when not found', async () => {
    findByIdMock.mockResolvedValue(null);

    const res = await request(app).get('/books/64b5d2fbcf1c8b0012a1a456');

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ message: 'Book not found' });
  });

  test('GET /books/:bookId rejects invalid MongoId with 400', async () => {
    const res = await request(app).get('/books/not-a-valid-id');
    expect(res.status).toBe(400);
  });

  test('GET /books/:bookId can trigger 500 via ?forceError=true', async () => {
    const res = await request(app)
      .get('/books/64b5d2fbcf1c8b0012a1a456')
      .query({ forceError: 'true' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Internal server error' });
  });
});

