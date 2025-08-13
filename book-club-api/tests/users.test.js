import express from 'express';
import request from 'supertest';
import { jest } from '@jest/globals';

const findMock = jest.fn();
const findByIdMock = jest.fn();

jest.unstable_mockModule('../models/User.js', () => {
  return {
    default: {
      find: findMock,
      findById: findByIdMock,
    },
  };
});

const { default: usersRoutes } = await import('../routes/usersRoutes.js');

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/users', usersRoutes);
  app.use((err, _req, res, _next) => res.status(500).json({ message: 'Internal server error' }));
  return app;
};

describe('Users routes', () => {
  let app;

  beforeEach(() => {
    app = buildApp();
    findMock.mockReset();
    findByIdMock.mockReset();
  });

  // ---------- GET /users ----------
  test('GET /users returns 200 and an array', async () => {
    const sortSpy = jest.fn().mockResolvedValue([
      { _id: 'u1', name: 'Barbara Doe', email: 'barbara@example.com' },
      { _id: 'u2', name: 'Alex Roe', email: 'alex@example.com' },
    ]);
    findMock.mockReturnValue({ sort: sortSpy });

    const res = await request(app).get('/users');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(findMock).toHaveBeenCalledWith(); 
    expect(sortSpy).toHaveBeenCalledWith({ createdAt: -1 });
  });

  test('GET /users can trigger 500 via ?forceError=true', async () => {
    const res = await request(app).get('/users').query({ forceError: 'true' });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Internal server error' });
  });

  // ---------- GET /users/:userId ----------
  test('GET /users/:userId returns 200 and the user (when found)', async () => {
    const id = '64b5d2fbcf1c8b0012a1a456';
    findByIdMock.mockResolvedValue({ _id: id, name: 'Barbara Doe', email: 'barbara@example.com' });

    const res = await request(app).get(`/users/${id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ _id: id, name: 'Barbara Doe' });
    expect(findByIdMock).toHaveBeenCalledWith(id);
  });

  test('GET /users/:userId returns 404 when not found', async () => {
    const id = '64b5d2fbcf1c8b0012a1a456';
    findByIdMock.mockResolvedValue(null);

    const res = await request(app).get(`/users/${id}`);

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ message: 'User not found' });
  });

  test('GET /users/:userId rejects invalid MongoId with 400', async () => {
    const res = await request(app).get('/users/not-a-valid-id');
    expect(res.status).toBe(400);
  });

  test('GET /users/:userId can trigger 500 via ?forceError=true', async () => {
    const id = '64b5d2fbcf1c8b0012a1a456';
    const res = await request(app).get(`/users/${id}`).query({ forceError: 'true' });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Internal server error' });
  });
});
