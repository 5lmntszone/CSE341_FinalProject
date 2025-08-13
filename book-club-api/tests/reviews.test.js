import express from 'express';
import request from 'supertest';
import { jest } from '@jest/globals';

const reviewFindMock = jest.fn();
const bookExistsMock = jest.fn();

jest.unstable_mockModule('../models/Review.js', () => ({
  default: {
    find: reviewFindMock,
  },
}));

jest.unstable_mockModule('../models/Book.js', () => ({
  default: {
    exists: bookExistsMock,
  },
}));

const { default: reviewsRoutes } = await import('../routes/reviewsRoutes.js');

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/reviews', reviewsRoutes);
  app.use((err, _req, res, _next) => res.status(500).json({ message: 'Internal server error' }));
  return app;
};

describe('Reviews routes - GET /reviews', () => {
  let app;

  beforeEach(() => {
    app = buildApp();
    reviewFindMock.mockReset();
    bookExistsMock.mockReset();
  });

  test('returns 200 and an array (no filter)', async () => {
    const sortSpy = jest.fn().mockResolvedValue([
      { _id: 'r1', bookId: '64b5d2fbcf1c8b0012a1a456', userName: 'barbara', rating: 5, comment: 'Great' },
      { _id: 'r2', bookId: '64b5d2fbcf1c8b0012a1a456', userName: 'alex', rating: 4 },
    ]);
    reviewFindMock.mockReturnValue({ sort: sortSpy });

    const res = await request(app).get('/reviews');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(reviewFindMock).toHaveBeenCalledWith({});
    expect(sortSpy).toHaveBeenCalledWith({ createdAt: -1 });
  });

  test('applies bookId filter when provided', async () => {
    const sortSpy = jest.fn().mockResolvedValue([{ _id: 'r3', bookId: '64b5d2fbcf1c8b0012a1a456', userName: 'mike', rating: 3 }]);
    reviewFindMock.mockReturnValue({ sort: sortSpy });

    const bookId = '64b5d2fbcf1c8b0012a1a456';
    const res = await request(app).get('/reviews').query({ bookId });

    expect(res.status).toBe(200);
    expect(reviewFindMock).toHaveBeenCalledWith({ bookId });
    expect(sortSpy).toHaveBeenCalledWith({ createdAt: -1 });
    expect(res.body[0]).toMatchObject({ bookId });
  });

  test('rejects invalid bookId with 400 (express-validator)', async () => {
    const res = await request(app).get('/reviews').query({ bookId: 'not-a-mongoid' });

    expect(res.status).toBe(400);

  });

  test('can trigger 500 via ?forceError=true', async () => {
    const res = await request(app).get('/reviews').query({ forceError: 'true' });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Internal server error' });
  });
});
