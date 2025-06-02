import request from 'supertest';
import app from './index.js';

describe('Backend API Endpoints', () => {
  // Health check
  it('GET / should return backend server running message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('Backend сервер работает');
  });

  // Auth routes - basic test for 404 or method not allowed if no auth routes defined
  it('GET /api/auth should return 404 or method not allowed', async () => {
    const res = await request(app).get('/api/auth');
    expect([404, 405]).toContain(res.statusCode);
  });

  // User profile - unauthorized without token
  it('GET /api/users/me should return 401 without token', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.statusCode).toEqual(401);
  });

  // Inventory - get list
  it('GET /api/inventory should return 200 and array', async () => {
    const res = await request(app).get('/api/inventory');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Orders - unauthorized without token
  it('GET /api/orders should return 401 without token', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.statusCode).toEqual(401);
  });

  // Dashboard stats - unauthorized without token
  it('GET /api/dashboard/stats should return 401 without token', async () => {
    const res = await request(app).get('/api/dashboard/stats');
    expect(res.statusCode).toEqual(401);
  });
});
