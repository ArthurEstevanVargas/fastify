import Fastify, { type FastifyInstance } from 'fastify';
import sensible from './plugins/sensible';
import database from './plugins/database';
import errorHandler from './plugins/error-handler';
import { registerHealthRoute } from './modules/health.route';
import { registerCategoryRoutes } from './modules/categories/category.route';
import { registerAuthorRoutes } from './modules/authors/author.route';
import { registerArticleRoutes } from './modules/articles/article.route';
import { registerArticleSourceRoutes } from './modules/article-sources/article-source.route';

export const buildApp = async (): Promise<FastifyInstance> => {
  const fastify = Fastify({
    logger: true
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
