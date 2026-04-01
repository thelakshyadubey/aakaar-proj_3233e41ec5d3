if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const { Pool } = require('pg');

let pool;

async function connectDB() {
  const retries = 3;
  for (let i = 0; i < retries; i++) {
    try {
      pool = new Pool({ connectionString: process.env.DATABASE_URL });
      await pool.query('SELECT 1');
      console.log('Connected to PostgreSQL');
      return;
    } catch (err) {
      console.error(`Attempt ${i + 1} failed to connect to PostgreSQL:`, err.message);
      if (i === retries - 1) {
        throw err;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

async function disconnectDB() {
  if (pool) {
    await pool.end();
    console.log('Disconnected from PostgreSQL');
    pool = null;
  }
}

async function healthCheck() {
  if (!pool) {
    throw new Error('Database connection not initialized');
  }
  const res = await pool.query('SELECT 1 AS health');
  return res.rows[0].health === 1;
}

module.exports = {
  connectDB,
  disconnectDB,
  healthCheck
};