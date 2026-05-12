import type { FastifyInstance } from 'fastify';
import { errorResponseSchema } from '../../shared/schemas/common.schemas';
import {
  createArticleSource,
  deleteArticleSource,
  getArticleSource,
  listArticleSources,
  updateArticleSource
} from './article-source.controller';
import {
  articleSourceIdParamsSchema,
  articleSourceListQuerySchema,
  articleSourceListResponseSchema,
  articleSourceRouteResponses,
  createArticleSourceBodySchema,
  updateArticleSourceBodySchema
} from './article-source.schema';

export const registerArticleSourceRoutes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get(
    '/',
    { schema: { querystring: articleSourceListQuerySchema, response: { 200: articleSourceListResponseSchema } } },
    listArticleSources
  );

  fastify.get(
    '/:id',
    { schema: { params: articleSourceIdParamsSchema, response: articleSourceRouteResponses } },
    getArticleSource
  );

  fastify.post(
    '/',
    { schema: { body: createArticleSourceBodySchema, response: articleSourceRouteResponses } },
    createArticleSource
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        params: articleSourceIdParamsSchema,
        body: updateArticleSourceBodySchema,
        response: articleSourceRouteResponses
      }
    },
    updateArticleSource
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: articleSourceIdParamsSchema,
        response: { 204: { type: 'null' }, 404: errorResponseSchema }
      }
    },
    deleteArticleSource
  );
};
