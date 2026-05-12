import type { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

export interface Database {
  pool: Pool | null;
  query<T extends QueryResultRow>(text: string, values?: readonly unknown[]): Promise<QueryResult<T>>;
  transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T>;
  isAvailable(): boolean;
}

declare module 'fastify' {
  interface FastifyInstance {
    db: Database;
  }
}
