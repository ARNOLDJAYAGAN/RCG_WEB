import pkg from "pg";
const { Pool } = pkg;

if (!process.env.NEON_DB_URL) {
  console.error("❌ Missing NEON_DB_URL env variable");
}

export const pool = new Pool({
  connectionString: process.env.NEON_DB_URL,
  ssl: { rejectUnauthorized: false },
});

pool.connect()
  .then(() => console.log("✅ Connected to Neon DB"))
  .catch((err) => console.error("❌ DB connection error:", err));

// ✅ Export `db` so other modules can import it
export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};
