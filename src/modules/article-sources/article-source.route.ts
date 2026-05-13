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
    {
      schema: {
        tags: ['Article Sources'],
        summary: 'Lista fontes',
        description: 'Lista fontes ativas, opcionalmente filtradas por artigo.',
        querystring: articleSourceListQuerySchema,
        response: { 200: articleSourceListResponseSchema }
      }
    },
    listArticleSources
  );

  fastify.get(
    '/:id',
    {
      schema: {
        tags: ['Article Sources'],
        summary: 'Busca fonte',
        description: 'Busca uma fonte de artigo por id UUID.',
        params: articleSourceIdParamsSchema,
        response: articleSourceRouteResponses
      }
    },
    getArticleSource
  );

  fastify.post(
    '/',
    {
      schema: {
        tags: ['Article Sources'],
        summary: 'Cria fonte',
        description: 'Cria uma fonte vinculada a um artigo existente.',
        body: createArticleSourceBodySchema,
        response: articleSourceRouteResponses
      }
    },
    createArticleSource
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        tags: ['Article Sources'],
        summary: 'Atualiza fonte',
        description: 'Atualiza parcialmente uma fonte de artigo.',
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
        tags: ['Article Sources'],
        summary: 'Remove fonte',
        description: 'Remove logicamente uma fonte de artigo.',
        params: articleSourceIdParamsSchema,
        response: { 204: { type: 'null' }, 404: errorResponseSchema }
      }
    },
    deleteArticleSource
  );
};
