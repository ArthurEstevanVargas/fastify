import { describe, expect, it } from 'vitest';
import { buildApp } from '../../src/app';

const ADMIN_API_KEY = 'test-admin-api-key-with-32-characters';

describe('admin route authentication', () => {
  it('rejects mutating requests when ADMIN_API_KEY is not configured', async () => {
    const previousAdminApiKey = process.env.ADMIN_API_KEY;
    delete process.env.ADMIN_API_KEY;

    const app = await buildApp();

    try {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/categories',
        payload: {
          name: 'Categoria Teste',
          slug: 'categoria-teste',
          description: 'Descricao teste'
        }
      });

      expect(response.statusCode).toBe(503);
      expect(response.json()).toMatchObject({
        error: true,
        code: 'ADMIN_API_KEY_NOT_CONFIGURED'
      });
    } finally {
      await app.close();
      if (previousAdminApiKey) {
        process.env.ADMIN_API_KEY = previousAdminApiKey;
      }
    }
  });

  it('rejects mutating requests with an invalid API key', async () => {
    const previousAdminApiKey = process.env.ADMIN_API_KEY;
    process.env.ADMIN_API_KEY = ADMIN_API_KEY;

    const app = await buildApp();

    try {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/categories',
        headers: {
          'x-api-key': 'invalid-admin-api-key-with-32-chars'
        },
        payload: {
          name: 'Categoria Teste',
          slug: 'categoria-teste',
          description: 'Descricao teste'
        }
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toMatchObject({
        error: true,
        code: 'UNAUTHORIZED'
      });
    } finally {
      await app.close();
      if (previousAdminApiKey) {
        process.env.ADMIN_API_KEY = previousAdminApiKey;
      } else {
        delete process.env.ADMIN_API_KEY;
      }
    }
  });
});
