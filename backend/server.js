const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'NewsSummarizer',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Successfully connected to PostgreSQL database');
  release();
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  const { name, surname, email, password } = req.body;

  try {
    // Check if user exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        error: 'User with this email already exists'
      });
    }

    // Insert new user
    await pool.query(
      'INSERT INTO users (name, surname, email, password) VALUES ($1, $2, $3, $4)',
      [name, surname, email, password]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const user = result.rows[0];
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Error logging in' });
  }
});

app.post('/api/auth/change-password', async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    // Check if user exists and current password is correct
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, currentPassword]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Current password is incorrect'
      });
    }

    // Update password
    await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [newPassword, email]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ error: 'Error changing password' });
  }
});

// News Routes
app.get('/api/news/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // First, get user's top 3 categories
    const topCategoriesResult = await pool.query(
      `SELECT 
        UNNEST(ARRAY['Education', 'Economy', 'Finance', 'Weather', 'Culture', 'Fashion', 'Entertainment', 'Politics', 'Health', 'Sports', 'Technology']) as category,
        UNNEST(ARRAY[education, economy, finance, weather, culture, fashion, entertainment, politics, health, sports, technology]) as coefficient
      FROM categories 
      WHERE user_id = $1
      ORDER BY coefficient DESC
      LIMIT 3`,
      [userId]
    );

    // Get the newest news from the highest coefficient category
    const topCategory = topCategoriesResult.rows[0]?.category;
    // console.log(topCategory);
    let newestNews = [];
    if (topCategory) {
      const newestResult = await pool.query(
        'SELECT * FROM news WHERE category = $1 ORDER BY date DESC LIMIT 1',
        [topCategory]
      );
      newestNews = newestResult.rows;
    //   console.log(newestNews);
    }

    // Get other news from top 3 categories
    const topCategories = topCategoriesResult.rows.map(row => row.category);
    let allOtherNews = [];
    
    // Fetch news for each category separately
    for (const category of topCategories) {
      const result = await pool.query(
        'SELECT * FROM news WHERE category = $1 ORDER BY date DESC',
        [category]
      );
      allOtherNews = [...allOtherNews, ...result.rows];
    }

    // Combine and format the response
    let allNews = [...newestNews];
    
    // Add other news randomly
    const otherNews = allOtherNews
      .filter(news => !newestNews.find(n => n.id === news.id)) // Exclude the newest news
      .sort(() => Math.random() - 0.5) // Randomize
      .slice(0, 9); // Get 9 more news (total will be 10 with the newest one)

    allNews = [...allNews, ...otherNews];

    res.json(allNews);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/news/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const result = await pool.query('SELECT * FROM news WHERE category = $1 ORDER BY date DESC', [category]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/news/summary/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM news WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'News not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/category/update', async (req, res) => {
  const { userId, category } = req.body;

  try {
    // First, get the current category values
    const result = await pool.query(
      'SELECT * FROM categories WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      // If no record exists, create one with default values
      await pool.query(
        'INSERT INTO categories (user_id, education, economy, finance, weather, culture, fashion, entertainment, politics, health, sports, technology) VALUES ($1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)',
        [userId]
      );
    }

    // Update the specific category value
    await pool.query(
      `UPDATE categories SET ${category.toLowerCase()} = ${category.toLowerCase()} * 1.03 WHERE user_id = $1`,
      [userId]
    );

    res.json({ message: 'Category interest updated successfully' });
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ error: 'Error updating category interest' });
  }
});

app.post('/api/category/initialize', async (req, res) => {
  const { userId, categories } = req.body;
  // console.log(categories);

  try {
    
      await pool.query(
        `UPDATE categories SET education = 1, economy = 1, finance = 1, weather = 1, culture = 1, fashion = 1, entertainment = 1, politics = 1, health = 1, sports = 1, technology = 1 WHERE user_id = $1`,
        [userId]
      );
    // Then update the selected categories with higher coefficient (1.5)
    
    for (const category of categories) {
      await pool.query(
        `UPDATE categories SET ${category.toLowerCase()} = 1.05 WHERE user_id = $1`,
        [userId]
      );
    }

    res.json({ message: 'Categories initialized successfully' });
  } catch (err) {
    console.error('Error initializing categories:', err);
    res.status(500).json({ error: 'Error initializing categories' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 