import type { FastifyInstance } from 'fastify';
import { errorResponseSchema } from '../../shared/schemas/common.schemas';
import { createAuthor, deleteAuthor, getAuthor, listAuthors, updateAuthor } from './author.controller';
import {
  authorIdParamsSchema,
  authorListResponseSchema,
  authorRouteResponses,
  createAuthorBodySchema,
  updateAuthorBodySchema
} from './author.schema';

export const registerAuthorRoutes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get('/', { schema: { response: { 200: authorListResponseSchema } } }, listAuthors);

  fastify.get('/:id', { schema: { params: authorIdParamsSchema, response: authorRouteResponses } }, getAuthor);

  fastify.post('/', { schema: { body: createAuthorBodySchema, response: authorRouteResponses } }, createAuthor);

  fastify.patch(
    '/:id',
    { schema: { params: authorIdParamsSchema, body: updateAuthorBodySchema, response: authorRouteResponses } },
    updateAuthor
  );

  fastify.delete(
    '/:id',
    { schema: { params: authorIdParamsSchema, response: { 204: { type: 'null' }, 404: errorResponseSchema, 409: errorResponseSchema } } },
    deleteAuthor
  );
};
