import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import jwt from 'jsonwebtoken';
import authRoutes from './auth.js';
import { fixOrderResponseQuery } from './fix_order_response.js';
const { Pool } = pkg;

const app = express();
const port = 4000;
const JWT_SECRET = 'your_jwt_secret_key'; // Should match the one in auth.js

// Настройка подключения к PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'turbo_db',
  password: '12345',
  port: 5432,
});

app.use(cors());

app.use(express.json());

app.use('/api', authRoutes);

// Простой эндпоинт логина для получения JWT токена (тестовый, без проверки пароля)
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email обязателен' });
  }
  // В реальном приложении здесь должна быть проверка пароля и пользователя в БД
  const user = { id: 1, email }; // Заглушка пользователя
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Middleware для проверки JWT токена
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Токен не предоставлен' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Неверный токен' });
    req.user = user;
    next();
  });
}

// Пример базового маршрута для проверки сервера
app.get('/', (req, res) => {
  res.send('Backend сервер работает');
});

// Маршрут для получения данных текущего пользователя
app.get('/api/users/me', authenticateToken, async (req, res) => {
  console.log('GET /api/users/me called, user:', req.user);
  try {
    const userId = req.user.id;
    const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1 AND is_active = true', [userId]);
    if (result.rows.length === 0) {
      console.log('User not found in DB for id:', userId);
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка при получении данных пользователя:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршрут для получения пользователей
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role FROM users WHERE is_active = true');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршрут для обновления профиля пользователя
app.put('/api/users/profile', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { name, email, phone } = req.body;

  try {
    // Обновляем данные пользователя
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING id, name, email, phone, role',
      [name, email, phone, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка при обновлении профиля пользователя:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршрут для получения товаров (inventory)
app.get('/api/inventory', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршрут для получения информации о конкретном товаре
app.get('/api/inventory/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка при получении информации о товаре:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    // Получаем общее количество товаров
    const inventoryResult = await pool.query('SELECT SUM(quantity) AS totalInventory FROM products');
    const totalInventory = inventoryResult.rows[0].totalinventory || 0;

    // Получаем количество товаров с низким запасом
    const lowStockResult = await pool.query('SELECT COUNT(*) AS lowStockItems FROM products WHERE quantity < 5');
    const lowStockItems = lowStockResult.rows[0].lowstockitems || 0;

    // Получаем количество заказов в ожидании
    const pendingOrdersResult = await pool.query('SELECT COUNT(*) AS pendingOrders FROM orders WHERE status = $1', ['pending']);
    const pendingOrders = pendingOrdersResult.rows[0].pendingorders || 0;

    // Получаем количество завершенных заказов
    const completedOrdersResult = await pool.query('SELECT COUNT(*) AS completedOrders FROM orders WHERE status = $1', ['completed']);
    const completedOrders = completedOrdersResult.rows[0].completedorders || 0;

    // Получаем последние активности (мок-данные)
    const recentActivity = [
      { id: 1, type: 'order', action: 'Новый заказ', details: 'Заказ #ORD-1010 создан', time: '10 минут назад' },
      { id: 2, type: 'inventory', action: 'Обновление склада', details: 'Добавлено 5 единиц товара "Смартфон Xiaomi Redmi Note 11"', time: '30 минут назад' },
      { id: 3, type: 'order', action: 'Статус заказа', details: 'Заказ #ORD-1008 отмечен как выполненный', time: '1 час назад' },
      { id: 4, type: 'user', action: 'Новый пользователь', details: 'Зарегистрирован пользователь user@example.com', time: '2 часа назад' },
      { id: 5, type: 'inventory', action: 'Обновление склада', details: 'Списание товара "Планшет Apple iPad Air" (2 шт.)', time: '3 часа назад' },
    ];

    // Получаем данные по продажам за неделю (мок-данные)
    const salesData = [
      { date: '2024-01-15', orders: 8, revenue: 245000 },
      { date: '2024-01-16', orders: 12, revenue: 358000 },
      { date: '2024-01-17', orders: 10, revenue: 312000 },
      { date: '2024-01-18', orders: 15, revenue: 425000 },
      { date: '2024-01-19', orders: 18, revenue: 520000 },
      { date: '2024-01-20', orders: 14, revenue: 390000 },
      { date: '2024-01-21', orders: 16, revenue: 460000 },
    ];

    // Получаем распределение товаров по категориям
    const inventoryByCategoryResult = await pool.query('SELECT category, COUNT(*) AS count FROM products GROUP BY category');
    const inventoryByCategory = inventoryByCategoryResult.rows.map(row => ({
      category: row.category,
      count: parseInt(row.count, 10),
    }));

    // Получаем количество заказов по статусам
    const ordersByStatusResult = await pool.query('SELECT status, COUNT(*) AS count FROM orders GROUP BY status');
    const ordersByStatus = ordersByStatusResult.rows.map(row => ({
      status: row.status,
      count: parseInt(row.count, 10),
    }));

    res.json({
      totalInventory,
      lowStockItems,
      pendingOrders,
      completedOrders,
      recentActivity,
      salesData,
      inventoryByCategory,
      ordersByStatus,
    });
  } catch (err) {
    console.error('Ошибка в /api/dashboard/stats:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршрут для создания заказа
app.post('/api/orders', authenticateToken, async (req, res) => {
  const { customer, items, pickup, comment } = req.body;

  console.log('Полученные данные заказа:', req.body);

  try {
    const orderResult = await pool.query(
      'INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, pickup_point, comment) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [customer.name, customer.email, customer.phone, customer.address, pickup, comment]
    );

    console.log('Результат сохранения заказа:', orderResult.rows);

    const orderId = orderResult.rows[0].id;

    const itemQueries = items.map(item => {
      console.log('Сохранение товара:', item);
      return pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)',
        [orderId, item.id, item.quantity]
      );
    });

    await Promise.all(itemQueries);

    res.status(201).json({ id: orderId });
  } catch (err) {
    console.error('Ошибка при создании заказа:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршрут для добавления нового товара
app.post('/api/inventory', authenticateToken, async (req, res) => {
  const { name, sku, category, barcode, quantity, price, location, status, description, supplier } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO products (name, sku, category, barcode, quantity, price, location, status, description, supplier) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
      [name, sku, category, barcode, quantity, price, location, status, description, supplier]
    );

    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error('Ошибка при добавлении товара:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршрут для обновления информации о товаре
app.put('/api/inventory/:id', async (req, res) => {
  const { id } = req.params;
  const { name, quantity, price, description } = req.body;

  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, quantity = $2, price = $3, description = $4 WHERE id = $5 RETURNING *',
      [name, quantity, price, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка при обновлении товара:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Добавление маршрута для получения списка заказов
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT \n' +
      '  o.id, \n' +
      '  o.id AS number, \n' +
      '  o.customer_name AS customer, \n' +
      '  o.customer_email, \n' +
      '  o.customer_phone, \n' +
      '  o.customer_address, \n' +
      '  o.pickup_point AS pickup, \n' +
      '  o.comment, \n' +
      '  o.status, \n' +  // Added status field here
      '  o.created_at AS date, \n' +
      '  COALESCE(SUM(p.price * oi.quantity), 0) AS total, \n' +
      '  JSON_AGG( \n' +
      '    JSON_BUILD_OBJECT( \n' +
      '      \'product_id\', oi.product_id, \n' +
      '      \'quantity\', oi.quantity \n' +
      '    ) \n' +
      '  ) AS items \n' +
      'FROM orders o \n' +
      'LEFT JOIN order_items oi ON o.id = oi.order_id \n' +
      'LEFT JOIN products p ON oi.product_id = p.id \n' +
      'GROUP BY o.id'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении заказов:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршрут для обновления заказа
app.put('/api/orders/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { customer, items, pickup, comment, status } = req.body;

  try {
    // Обновляем основную информацию о заказе, включая статус
    await pool.query(
      'UPDATE orders SET customer_name = $1, customer_email = $2, customer_phone = $3, customer_address = $4, pickup_point = $5, comment = $6, status = $7 WHERE id = $8',
      [customer.name, customer.email, customer.phone, customer.address, pickup, comment, status, id]
    );

    // Удаляем старые позиции заказа
    await pool.query('DELETE FROM order_items WHERE order_id = $1', [id]);

    // Добавляем новые позиции заказа
    const itemQueries = items.map(item => {
      return pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)',
        [id, item.product_id, item.quantity]
      );
    });

    await Promise.all(itemQueries);

    res.status(200).json({ message: 'Заказ успешно обновлен' });
  } catch (err) {
    console.error('Ошибка при обновлении заказа:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Новый маршрут для получения деталей заказа по id
app.get('/api/orders/:id', async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`Запрос деталей заказа с id=${id}`);

    const orderResult = await pool.query(
      `SELECT 
        o.id,
        o.id AS number,
        o.customer_name AS customer_name,
        o.customer_email AS customer_email,
        o.customer_phone AS customer_phone,
        o.customer_address AS customer_address,
        o.pickup_point AS pickup,
        o.comment,
        o.status,
        o.created_at AS date
      FROM orders o
      WHERE o.id = $1`,
      [id]
    );

    if (orderResult.rows.length === 0) {
      console.log(`Заказ с id=${id} не найден`);
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    const order = orderResult.rows[0];

    const itemsResult = await pool.query(
      `SELECT 
        p.id AS product_id,
        p.name,
        p.sku,
        p.price,
        oi.quantity
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1`,
      [id]
    );

    // Формируем массив товаров с нужными полями
    const items = itemsResult.rows.map(item => ({
      product_id: item.product_id,
      name: item.name,
      sku: item.sku,
      price: parseFloat(item.price),
      quantity: item.quantity
    }));

    // Рассчитываем подытог, скидку и итог (здесь для примера скидка 0)
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = 0;
    const total = subtotal * (1 - discount / 100);

    // Формируем объект customer
    const customer = {
      name: order.customer_name,
      email: order.customer_email,
      phone: order.customer_phone,
      address: order.customer_address
    };

    // Для истории заказа пока пустой массив (можно расширить при необходимости)
    const history = [];

    res.json({
      number: order.number,
      date: order.date,
      status: order.status,
      items,
      subtotal,
      discount,
      total,
      customer,
      pickup: order.pickup,
      trackingNumber: order.trackingNumber,
      comment: order.comment,
      history
    });
  } catch (err) {
    console.error('Ошибка при получении деталей заказа:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршрут для удаления заказа
app.delete('/api/orders/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Удаляем позиции заказа
    await pool.query('DELETE FROM order_items WHERE order_id = $1', [id]);

    // Удаляем сам заказ
    const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING id', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    res.status(200).json({ message: 'Заказ успешно удален' });
  } catch (err) {
    console.error('Ошибка при удалении заказа:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default app;
