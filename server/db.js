import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseUrl = process.env.DATABASE_URL;

let pool = null;
let isPostgresAvailable = false;

if (databaseUrl) {
  try {
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
    isPostgresAvailable = true;
    console.log('✅ PostgreSQL client configured for database connection.');
  } catch (err) {
    console.warn('⚠️ Could not initialize PostgreSQL pool, falling back to local memory store.', err);
  }
} else {
  console.log('ℹ️ No DATABASE_URL found. Running with high-speed in-memory database store for local dev.');
}

// Memory Store Fallback
const memoryDB = {
  users: [
    {
      id: 'usr_admin',
      name: 'Éternelle Master Admin',
      email: 'admin@eternelle.com',
      password_hash: '$2a$10$FoxMasterHash967777',
      role: 'admin',
      plan: 'lifetime',
      license_key: 'GUM-LIFETIME-ADMIN01',
      created_at: new Date().toISOString()
    }
  ],
  weddings: {},
  rsvps: {},
  orders: []
};

// Initialize schema on startup if connected to Postgres
export async function initializeDatabase() {
  if (isPostgresAvailable && pool) {
    try {
      const client = await pool.connect();
      try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        if (fs.existsSync(schemaPath)) {
          const sql = fs.readFileSync(schemaPath, 'utf8');
          await client.query(sql);
          console.log('✅ PostgreSQL tables verified & synchronized successfully.');
        }
      } finally {
        client.release();
      }
    } catch (err) {
      console.error('⚠️ PostgreSQL connection failed on startup. Utilizing memory store.', err.message);
      isPostgresAvailable = false;
    }
  }
}

export async function query(text, params = []) {
  if (isPostgresAvailable && pool) {
    return pool.query(text, params);
  }
  return null;
}

export { isPostgresAvailable, memoryDB, pool };
