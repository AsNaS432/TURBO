import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import jwt from 'jsonwebtoken';
import authRoutes from './auth.js';
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

// Маршрут для получения статистики дашборда
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    // Временно возвращаем заглушки для проверки frontend
    const stats = {
      totalInventory: 0,
      lowStockItems: 0,
      pendingOrders: 0,
      completedOrders: 0,
      recentActivity: [],
      inventoryByCategory: [],
      ordersByStatus: [],
      salesData: []
    };
    res.json(stats);
  } catch (err) {
    console.error('Ошибка в /api/dashboard/stats:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.listen(port, () => {
  console.log(`Backend сервер запущен на http://localhost:${port}`);
});
