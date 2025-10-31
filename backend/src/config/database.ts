import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Main database pool for user data
export const mainPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'golden_whisk_main',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

// Function to create a sandbox pool for a specific user
export const createSandboxPool = (userId: string): Pool => {
  return new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: `${process.env.SANDBOX_DB_PREFIX || 'golden_whisk_sandbox_'}${userId}`,
    user: process.env.SANDBOX_DB_USER || 'postgres',
    password: process.env.SANDBOX_DB_PASSWORD || 'postgres',
  });
};

// Test connection
mainPool.on('connect', () => {
  console.log('✅ Connected to main database');
});

mainPool.on('error', (err) => {
  console.error('❌ Main database connection error:', err);
});

