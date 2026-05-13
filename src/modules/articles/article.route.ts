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
  fastify.get(
    '/',
    {
      schema: {
        tags: ['Articles'],
        summary: 'Lista artigos',
        description: 'Lista artigos publicados com filtros e paginacao.',
        querystring: articleListQuerySchema,
        response: { 200: articleListResponseSchema }
      }
    },
    listArticles
  );

  fastify.get(
    '/featured',
    {
      schema: {
        tags: ['Articles'],
        summary: 'Lista artigos em destaque',
        description: 'Lista artigos publicados em destaque. A implementacao forca featured=true.',
        querystring: articleListQuerySchema,
        response: { 200: articleListResponseSchema }
      }
    },
    listFeaturedArticles
  );

  fastify.get(
    '/search',
    {
      schema: {
        tags: ['Articles'],
        summary: 'Busca artigos',
        description: 'Busca artigos publicados por texto usando o indice de busca em portugues.',
        querystring: articleSearchQuerySchema,
        response: { 200: articleListResponseSchema, 400: errorResponseSchema }
      }
    },
    searchArticles
  );

  fastify.get(
    '/:idOrSlug',
    {
      schema: {
        tags: ['Articles'],
        summary: 'Busca artigo',
        description: 'Busca detalhe de artigo publicado por id UUID ou slug.',
        params: articleIdOrSlugParamsSchema,
        response: articleRouteResponses
      }
    },
    getArticle
  );

  fastify.post(
    '/',
    {
      schema: {
        tags: ['Articles'],
        summary: 'Cria artigo',
        description: 'Cria um artigo. Artigos publicados exigem publishedAt.',
        body: createArticleBodySchema,
        response: articleRouteResponses
      }
    },
    createArticle
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        tags: ['Articles'],
        summary: 'Atualiza artigo',
        description: 'Atualiza parcialmente um artigo existente.',
        params: articleIdParamsSchema,
        body: updateArticleBodySchema,
        response: articleRouteResponses
      }
    },
    updateArticle
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        tags: ['Articles'],
        summary: 'Remove artigo',
        description: 'Remove logicamente um artigo.',
        params: articleIdParamsSchema,
        response: { 204: { type: 'null' }, 404: errorResponseSchema }
      }
    },
    deleteArticle
  );
};
