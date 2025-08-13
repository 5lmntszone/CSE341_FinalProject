import express from 'express';
import request from 'supertest';
import { jest } from '@jest/globals';

const findMock = jest.fn();
const findByIdMock = jest.fn();

jest.unstable_mockModule('../models/Meeting.js', () => {
  return {
    default: {
      find: findMock,
      findById: findByIdMock,
    },
  };
});

const { default: meetingsRoutes } = await import('../routes/meetingsRoutes.js');

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/meetings', meetingsRoutes);
  app.use((err, _req, res, _next) => res.status(500).json({ message: 'Internal server error' }));
  return app;
};

describe('Meetings routes', () => {
  let app;

  beforeEach(() => {
    app = buildApp();
    findMock.mockReset();
    findByIdMock.mockReset();
  });

  // ---------- GET /meetings ----------
  test('GET /meetings returns 200 and an array (no filters)', async () => {
    const sortSpy = jest.fn().mockResolvedValue([
      {
        _id: 'm1',
        title: 'August Book Club',
        bookId: '64b5d2fbcf1c8b0012a1a456',
        organizerId: '64b5d2fbcf1c8b0012a1b999',
        startsAt: '2025-09-01T18:00:00.000Z',
      },
      {
        _id: 'm2',
        title: 'September Book Club',
        bookId: '64b5d2fbcf1c8b0012a1a456',
        organizerId: '64b5d2fbcf1c8b0012a1b999',
        startsAt: '2025-10-01T18:00:00.000Z',
      },
    ]);
    findMock.mockReturnValue({ sort: sortSpy });

    const res = await request(app).get('/meetings');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(findMock).toHaveBeenCalledWith({});
    expect(sortSpy).toHaveBeenCalledWith({ startsAt: 1 });
  });

  test('GET /meetings applies bookId and organizerId filters', async () => {
    const sortSpy = jest.fn().mockResolvedValue([{ _id: 'm3' }]);
    findMock.mockReturnValue({ sort: sortSpy });

    const bookId = '64b5d2fbcf1c8b0012a1a456';
    const organizerId = '64b5d2fbcf1c8b0012a1b999';
    const res = await request(app).get('/meetings').query({ bookId, organizerId });

    expect(res.status).toBe(200);
    expect(findMock).toHaveBeenCalledWith({ bookId, organizerId });
    expect(sortSpy).toHaveBeenCalledWith({ startsAt: 1 });
  });

  test('GET /meetings rejects invalid bookId with 400', async () => {
    const res = await request(app).get('/meetings').query({ bookId: 'not-a-mongoid' });
    expect(res.status).toBe(400);
  });

  test('GET /meetings rejects invalid organizerId with 400', async () => {
    const res = await request(app).get('/meetings').query({ organizerId: 'nope' });
    expect(res.status).toBe(400);
  });

  test('GET /meetings can trigger 500 via ?forceError=true', async () => {
    const res = await request(app).get('/meetings').query({ forceError: 'true' });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Internal server error' });
  });

  // ---------- GET /meetings/:meetingId ----------
  test('GET /meetings/:meetingId returns 200 and the meeting (when found)', async () => {
    const id = '64b5d2fbcf1c8b0012a1aaaa';
    findByIdMock.mockResolvedValue({
      _id: id,
      title: 'October Club',
      startsAt: '2025-11-01T18:00:00.000Z',
    });

    const res = await request(app).get(`/meetings/${id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ _id: id, title: 'October Club' });
    expect(findByIdMock).toHaveBeenCalledWith(id);
  });

  test('GET /meetings/:meetingId returns 404 when not found', async () => {
    const id = '64b5d2fbcf1c8b0012a1aaaa';
    findByIdMock.mockResolvedValue(null);

    const res = await request(app).get(`/meetings/${id}`);

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ message: 'Meeting not found' });
  });

  test('GET /meetings/:meetingId rejects invalid MongoId with 400', async () => {
    const res = await request(app).get('/meetings/not-a-valid-id');
    expect(res.status).toBe(400);
  });

  test('GET /meetings/:meetingId can trigger 500 via ?forceError=true', async () => {
    const id = '64b5d2fbcf1c8b0012a1aaaa';
    const res = await request(app).get(`/meetings/${id}`).query({ forceError: 'true' });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Internal server error' });
  });
});
