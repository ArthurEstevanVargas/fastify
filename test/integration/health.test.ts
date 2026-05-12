import { describe, expect, it } from 'vitest';
import { buildApp } from '../../src/app';

describe('GET /health', () => {
  it('returns unavailable when DATABASE_URL is not configured', async () => {
    const previousDatabaseUrl = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;

    const app = await buildApp();

    try {
      const response = await app.inject({ method: 'GET', url: '/health' });

      expect(response.statusCode).toBe(503);
      expect(response.json()).toEqual({
        status: 'error',
        database: 'unavailable'
      });
    } finally {
      await app.close();
      if (previousDatabaseUrl) {
        process.env.DATABASE_URL = previousDatabaseUrl;
      }
    }
  });
});
