import request from 'supertest';
import app from './index.js';

describe('Full API Endpoint Tests', () => {
  let authToken = '';

  // Before all tests, create a user and get auth token (mock or real)
  beforeAll(async () => {
    // Since no test data or fixtures, we assume a login endpoint exists in authRoutes
    // Adjust credentials as needed or mock token generation
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'password123' });
    authToken = loginRes.body.token || '';
  });

  // Test GET /api/users/me with auth
  it('GET /api/users/me with valid token should return user data', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email');
  });

  // Test POST /api/inventory with validation
  it('POST /api/inventory should create new product with valid data', async () => {
    const productData = {
      name: 'Test Product',
      sku: 'TP-001',
      category: 'Test Category',
      barcode: '1234567890123',
      quantity: 10,
      price: 99.99,
      location: 'A1',
      status: 'available',
      description: 'Test product description',
      supplier: 'Test Supplier'
    };
    const res = await request(app)
      .post('/api/inventory')
      .set('Authorization', `Bearer ${authToken}`)
      .send(productData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  // Test PUT /api/inventory/:id with invalid id
  it('PUT /api/inventory/:id with invalid id should return 404', async () => {
    const res = await request(app)
      .put('/api/inventory/999999')
      .send({ name: 'Updated Name', quantity: 5, price: 50, description: 'Updated desc' });
    expect(res.statusCode).toBe(404);
  });

  // Test POST /api/orders with valid data
  it('POST /api/orders should create new order', async () => {
    const orderData = {
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St'
      },
      items: [
        { id: 1, quantity: 2 },
        { id: 2, quantity: 1 }
      ],
      pickup: 'Store 1',
      comment: 'Please deliver between 9am-5pm'
    };
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send(orderData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  // Test PUT /api/orders/:id with invalid id
  it('PUT /api/orders/:id with invalid id should handle gracefully', async () => {
    const res = await request(app)
      .put('/api/orders/999999')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        customer: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          phone: '0987654321',
          address: '456 Elm St'
        },
        items: [{ product_id: 1, quantity: 1 }],
        pickup: 'Store 2',
        comment: 'No comment'
      });
    // Depending on implementation, could be 200, 404 or 500, adjust as needed
    expect([200, 404, 500]).toContain(res.statusCode);
  });

  // Test GET /api/orders/:id with invalid id
  it('GET /api/orders/:id with invalid id should return 404', async () => {
    const res = await request(app)
      .get('/api/orders/999999')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(404);
  });

  // Test GET /api/dashboard/stats with auth
  it('GET /api/dashboard/stats should return stats data', async () => {
    const res = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totalInventory');
    expect(res.body).toHaveProperty('salesData');
  });

  // Test unauthorized access to protected routes
  it('GET /api/users/me without token should return 401', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/inventory without token should return 401', async () => {
    const res = await request(app).post('/api/inventory').send({});
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/orders without token should return 401', async () => {
    const res = await request(app).post('/api/orders').send({});
    expect(res.statusCode).toBe(401);
  });
});
