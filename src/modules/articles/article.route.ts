import type { FastifyInstance } from 'fastify';
import { errorResponseSchema } from '../../shared/schemas/common.schemas';
import {
  createArticle,
  deleteArticle,
  getArticle,
  listArticles,
  listFeaturedArticles,
  searchArticles,
  updateArticle
} from './article.controller';
import {
  articleIdOrSlugParamsSchema,
  articleIdParamsSchema,
  articleListQuerySchema,
  articleListResponseSchema,
  articleRouteResponses,
  articleSearchQuerySchema,
  createArticleBodySchema,
  updateArticleBodySchema
} from './article.schema';

export const registerArticleRoutes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get('/', { schema: { querystring: articleListQuerySchema, response: { 200: articleListResponseSchema } } }, listArticles);

  fastify.get(
    '/featured',
    { schema: { querystring: articleListQuerySchema, response: { 200: articleListResponseSchema } } },
    listFeaturedArticles
  );

  fastify.get(
    '/search',
    { schema: { querystring: articleSearchQuerySchema, response: { 200: articleListResponseSchema, 400: errorResponseSchema } } },
    searchArticles
  );

  fastify.get(
    '/:idOrSlug',
    { schema: { params: articleIdOrSlugParamsSchema, response: articleRouteResponses } },
    getArticle
  );

  fastify.post('/', { schema: { body: createArticleBodySchema, response: articleRouteResponses } }, createArticle);

  fastify.patch(
    '/:id',
    { schema: { params: articleIdParamsSchema, body: updateArticleBodySchema, response: articleRouteResponses } },
    updateArticle
  );

  fastify.delete(
    '/:id',
    { schema: { params: articleIdParamsSchema, response: { 204: { type: 'null' }, 404: errorResponseSchema } } },
    deleteArticle
  );
};
