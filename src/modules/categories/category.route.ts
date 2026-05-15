import type { FastifyInstance, RouteHandlerMethod } from 'fastify';
import { requireAdminApiKey } from '../../plugins/admin-auth';
import {
  categoryIdOrSlugParamsSchema,
  categoryIdParamsSchema,
  categoryListResponseSchema,
  categoryRouteResponses,
  createCategoryBodySchema,
  updateCategoryBodySchema
} from './category.schema';
import { createCategory, deleteCategory, getCategory, listCategories, updateCategory } from './category.controller';
import { adminRouteSecurity, errorResponseSchema } from '../../shared/schemas/common.schemas';

export const registerCategoryRoutes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get(
    '/',
    {
      schema: {
        tags: ['Categories'],
        summary: 'Lista categorias',
        description: 'Lista categorias ativas ordenadas por displayOrder e nome.',
        response: { 200: categoryListResponseSchema }
      }
    },
    listCategories
  );

  fastify.get(
    '/:idOrSlug',
    {
      schema: {
        tags: ['Categories'],
        summary: 'Busca categoria',
        description: 'Busca uma categoria ativa por id UUID ou slug.',
        params: categoryIdOrSlugParamsSchema,
        response: categoryRouteResponses
      }
    },
    getCategory
  );

  fastify.post(
    '/',
    {
      preHandler: requireAdminApiKey,
      schema: {
        tags: ['Categories'],
        summary: 'Cria categoria',
        description: 'Cria uma categoria editorial. Slugs devem ser unicos.',
        security: adminRouteSecurity,
        body: createCategoryBodySchema,
        response: categoryRouteResponses
      }
    },
    createCategory as RouteHandlerMethod
  );

  fastify.patch(
    '/:id',
    {
      preHandler: requireAdminApiKey,
      schema: {
        tags: ['Categories'],
        summary: 'Atualiza categoria',
        description: 'Atualiza parcialmente uma categoria existente.',
        security: adminRouteSecurity,
        params: categoryIdParamsSchema,
        body: updateCategoryBodySchema,
        response: categoryRouteResponses
      }
    },
    updateCategory as RouteHandlerMethod
  );

  fastify.delete(
    '/:id',
    {
      preHandler: requireAdminApiKey,
      schema: {
        tags: ['Categories'],
        summary: 'Remove categoria',
        description: 'Remove logicamente uma categoria. Categorias com artigos ativos nao podem ser removidas.',
        security: adminRouteSecurity,
        params: categoryIdParamsSchema,
        response: { 204: { type: 'null' }, 404: errorResponseSchema, 409: errorResponseSchema }
      }
    },
    deleteCategory as RouteHandlerMethod
  );
};
