// test-db.cjs
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

console.log("NEON_DB_URL:", process.env.NEON_DB_URL); // <-- check if it's loaded

const pool = new Pool({
  connectionString: process.env.NEON_DB_URL,
  ssl: { rejectUnauthorized: false },
});

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Connection successful! Server time:', res.rows[0]);
  } catch (err) {
    console.error('❌ Connection failed:', err);
  } finally {
    await pool.end();
  }
}

testConnection();
