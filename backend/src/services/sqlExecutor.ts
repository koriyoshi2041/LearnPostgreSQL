import { Pool } from 'pg';
import { ExecutionResult } from '../types';

const SQL_TIMEOUT = parseInt(process.env.SQL_TIMEOUT_MS || '3000');

// Dangerous commands that should be blocked
const DANGEROUS_PATTERNS = [
  /DROP\s+DATABASE/i,
  /DROP\s+SCHEMA/i,
  /ALTER\s+SYSTEM/i,
  /COPY.*FROM.*PROGRAM/i,
];

export class SQLExecutor {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async execute(sql: string): Promise<ExecutionResult> {
    const startTime = Date.now();

    try {
      // Security check
      for (const pattern of DANGEROUS_PATTERNS) {
        if (pattern.test(sql)) {
          return {
            success: false,
            error: 'This SQL command is not allowed for security reasons.'
          };
        }
      }

      // Execute with timeout
      const client = await this.pool.connect();
      
      try {
        await client.query(`SET statement_timeout = ${SQL_TIMEOUT}`);
        const result = await client.query(sql);
        
        const executionTime = Date.now() - startTime;

        return {
          success: true,
          data: result.rows,
          rowCount: result.rowCount || 0,
          executionTime
        };
      } finally {
        client.release();
      }
    } catch (error: any) {
      return {
        success: false,
        error: this.formatError(error),
        executionTime: Date.now() - startTime
      };
    }
  }

  private formatError(error: any): string {
    if (error.code) {
      const errorMap: { [key: string]: string } = {
        '42P07': 'Table already exists. Did you mean to use a different name?',
        '42P01': 'Table does not exist. Check your spelling and make sure the table was created.',
        '42703': 'Column does not exist. Check the column name spelling.',
        '23505': 'This value already exists. UNIQUE constraint violation.',
        '23503': 'Foreign key constraint violation. The referenced record does not exist.',
        '23502': 'NOT NULL constraint violation. This column requires a value.',
        '23514': 'CHECK constraint violation. The value does not meet the required condition.',
        '42601': 'Syntax error. Check your SQL syntax.',
        '42804': 'Data type mismatch. The value type does not match the column type.',
      };

      const friendlyMessage = errorMap[error.code];
      if (friendlyMessage) {
        return `${friendlyMessage}\n\nDetails: ${error.message}`;
      }
    }

    return error.message || 'An unknown error occurred';
  }

  async checkTableExists(tableName: string): Promise<boolean> {
    const result = await this.execute(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = '${tableName}'
      );
    `);
    
    return result.success && result.data && result.data[0].exists;
  }

  async checkExtensionEnabled(extensionName: string): Promise<boolean> {
    const result = await this.execute(`
      SELECT EXISTS (
        SELECT FROM pg_extension 
        WHERE extname = '${extensionName}'
      );
    `);
    
    return result.success && result.data && result.data[0].exists;
  }

  async checkTypeExists(typeName: string): Promise<boolean> {
    const result = await this.execute(`
      SELECT EXISTS (
        SELECT FROM pg_type 
        WHERE typname = '${typeName}'
      );
    `);
    
    return result.success && result.data && result.data[0].exists;
  }

  async getTableColumns(tableName: string): Promise<string[]> {
    const result = await this.execute(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = '${tableName}'
      ORDER BY ordinal_position;
    `);
    
    if (result.success && result.data) {
      return result.data.map(row => row.column_name);
    }
    
    return [];
  }
}

