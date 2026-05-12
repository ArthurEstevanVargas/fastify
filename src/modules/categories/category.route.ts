import type { FastifyInstance } from 'fastify';
import {
  categoryIdOrSlugParamsSchema,
  categoryIdParamsSchema,
  categoryListResponseSchema,
  categoryRouteResponses,
  createCategoryBodySchema,
  updateCategoryBodySchema
} from './category.schema';
import { createCategory, deleteCategory, getCategory, listCategories, updateCategory } from './category.controller';
import { errorResponseSchema } from '../../shared/schemas/common.schemas';

export const registerCategoryRoutes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get('/', { schema: { response: { 200: categoryListResponseSchema } } }, listCategories);

  fastify.get(
    '/:idOrSlug',
    { schema: { params: categoryIdOrSlugParamsSchema, response: categoryRouteResponses } },
    getCategory
  );

  fastify.post('/', { schema: { body: createCategoryBodySchema, response: categoryRouteResponses } }, createCategory);

  fastify.patch(
    '/:id',
    { schema: { params: categoryIdParamsSchema, body: updateCategoryBodySchema, response: categoryRouteResponses } },
    updateCategory
  );

  fastify.delete(
    '/:id',
    { schema: { params: categoryIdParamsSchema, response: { 204: { type: 'null' }, 404: errorResponseSchema, 409: errorResponseSchema } } },
    deleteCategory
  );
};
