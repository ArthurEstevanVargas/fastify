import fp from 'fastify-plugin';
import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from 'pg';
import { loadEnv } from '../config/env';
import { AppError } from '../shared/errors/app-error';
import type { Database } from '../types/database';

const createUnavailableDatabase = (): Database => ({
  pool: null,
  async query<T extends QueryResultRow>(): Promise<QueryResult<T>> {
    throw AppError.serviceUnavailable();
  },
  async transaction<T>(): Promise<T> {
    throw AppError.serviceUnavailable();
  },
  isAvailable(): boolean {
    return false;
  }
});

export default fp(async (fastify) => {
  const env = loadEnv();

  if (!env.databaseUrl) {
    fastify.decorate('db', createUnavailableDatabase());
    return;
  }

  const pool = new Pool({
    connectionString: env.databaseUrl
  });

  const database: Database = {
    pool,
    query<T extends QueryResultRow>(text: string, values?: readonly unknown[]): Promise<QueryResult<T>> {
      return pool.query<T>(text, values ? [...values] : undefined);
    },
    async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
      const client = await pool.connect();

      try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    },
    isAvailable(): boolean {
      return true;
    }
  };

  fastify.decorate('db', database);

  fastify.addHook('onClose', async () => {
    await pool.end();
  });
});
