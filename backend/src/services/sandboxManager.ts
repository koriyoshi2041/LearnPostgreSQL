import { Pool } from 'pg';
import { createSandboxPool } from '../config/database';

export class SandboxManager {
  private sandboxPools: Map<string, Pool> = new Map();

  async getOrCreateSandbox(userId: string): Promise<Pool> {
    // Check if sandbox pool already exists
    if (this.sandboxPools.has(userId)) {
      return this.sandboxPools.get(userId)!;
    }

    // Create new sandbox pool
    const pool = createSandboxPool(userId);
    
    // Try to connect and create database if it doesn't exist
    try {
      await pool.query('SELECT 1');
    } catch (error) {
      // Database might not exist, create it
      await this.createSandboxDatabase(userId);
    }

    this.sandboxPools.set(userId, pool);
    return pool;
  }

  private async createSandboxDatabase(userId: string): Promise<void> {
    const { Pool } = require('pg');
    const adminPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: 'postgres', // Connect to default database to create new one
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    });

    try {
      const dbName = `${process.env.SANDBOX_DB_PREFIX || 'golden_whisk_sandbox_'}${userId}`;
      await adminPool.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Created sandbox database: ${dbName}`);
    } catch (error: any) {
      if (error.code !== '42P04') { // 42P04 = database already exists
        console.error('Error creating sandbox database:', error);
      }
    } finally {
      await adminPool.end();
    }
  }

  async resetSandbox(userId: string): Promise<void> {
    const pool = await this.getOrCreateSandbox(userId);
    
    // Drop all tables, types, extensions
    await pool.query(`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        -- Drop all tables
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
        
        -- Drop all types
        FOR r IN (SELECT typname FROM pg_type WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) LOOP
          EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
        END LOOP;
      END $$;
    `);

    console.log(`✅ Reset sandbox for user: ${userId}`);
  }

  async closeSandbox(userId: string): Promise<void> {
    const pool = this.sandboxPools.get(userId);
    if (pool) {
      await pool.end();
      this.sandboxPools.delete(userId);
    }
  }

  async closeAll(): Promise<void> {
    for (const [userId, pool] of this.sandboxPools) {
      await pool.end();
    }
    this.sandboxPools.clear();
  }
}

