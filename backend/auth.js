import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';

const router = express.Router();
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'turbo_db',
  password: '12345',
  port: 5432,
});

const JWT_SECRET = 'your_jwt_secret_key'; // Replace with a secure key in production

// Регистрация пользователя с хешированием пароля
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Пожалуйста, заполните все обязательные поля' });
  }

  try {
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (name, email, password, is_active) VALUES ($1, $2, $3, true) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    const newUser = result.rows[0];
    res.status(201).json({ user: newUser });
  } catch (err) {
    console.error('Ошибка при регистрации пользователя:', err);
    res.status(500).json({ error: 'Ошибка сервера при регистрации' });
  }
});

// Вход пользователя с проверкой пароля и генерацией JWT
router.post('/login', async (req, res) => {
  console.log('Login request data: ', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Пожалуйста, заполните все обязательные поля' });
  }

  try {
    const userResult = await pool.query('SELECT id, name, email, password, role FROM users WHERE email = $1 AND is_active = true', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const user = userResult.rows[0];    // Сравнение пароля с использованием bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Ошибка при входе пользователя:', err);
    res.status(500).json({ error: 'Ошибка сервера при входе' });
  }
});

export default router;
