import { describe, expect, it } from 'vitest';
import { buildApp } from '../../src/app';

describe('Swagger documentation', () => {
  it('exposes the generated OpenAPI document', async () => {
    const app = await buildApp();

    try {
      const response = await app.inject({ method: 'GET', url: '/docs/json' });
      const document = response.json();

      expect(response.statusCode).toBe(200);
      expect(document.openapi).toBe('3.0.3');
      expect(document.info.title).toBe('Minha Saude Feminina API');
      expect(document.paths).toHaveProperty('/health');
      expect(document.components.securitySchemes).toHaveProperty('AdminApiKey');
      expect(document.components.securitySchemes).toHaveProperty('AdminBearerAuth');

      const categoriesPath = Object.entries(document.paths as Record<string, { post?: { security?: unknown } }>).find(
        ([path]) => {
          return path.replace(/\/$/, '') === '/api/v1/categories';
        }
      );

      expect(categoriesPath).toBeDefined();
      expect(categoriesPath?.[1].post?.security).toEqual([{ AdminApiKey: [] }, { AdminBearerAuth: [] }]);
    } finally {
      await app.close();
    }
  });
});
