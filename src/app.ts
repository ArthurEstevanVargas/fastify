import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { loadEnv } from './config/env';
import sensible from './plugins/sensible';
import database from './plugins/database';
import errorHandler from './plugins/error-handler';
import { registerHealthRoute } from './modules/health.route';
import { registerCategoryRoutes } from './modules/categories/category.route';
import { registerAuthorRoutes } from './modules/authors/author.route';
import { registerArticleRoutes } from './modules/articles/article.route';
import { registerArticleSourceRoutes } from './modules/article-sources/article-source.route';

export const buildApp = async (): Promise<FastifyInstance> => {
  const env = loadEnv();
  const fastify = Fastify({
    logger: {
      redact: [
        'req.headers.authorization',
        'req.headers.cookie',
        'req.headers["x-api-key"]',
        'req.body.password',
        'req.body.token',
        'req.body.secret',
        '*.password',
        '*.token',
        '*.secret',
        '*.apiKey',
        '*.databaseUrl',
        '*.connectionString'
      ]
    }
  });

  await fastify.register(cors, {
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (env.nodeEnv !== 'production' && env.corsOrigins.length === 0) {
        callback(null, true);
        return;
      }

      callback(null, env.corsOrigins.includes(origin));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    credentials: true,
    maxAge: 86400
  });

  await fastify.register(sensible);
  await fastify.register(database);
  await fastify.register(errorHandler);

  await fastify.register(registerHealthRoute);
  await fastify.register(registerCategoryRoutes, { prefix: '/api/v1/categories' });
  await fastify.register(registerAuthorRoutes, { prefix: '/api/v1/authors' });
  await fastify.register(registerArticleRoutes, { prefix: '/api/v1/articles' });
  await fastify.register(registerArticleSourceRoutes, { prefix: '/api/v1/article-sources' });

  return fastify;
};
