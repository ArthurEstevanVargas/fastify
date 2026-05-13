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
  fastify.get(
    '/',
    {
      schema: {
        tags: ['Authors'],
        summary: 'Lista autores',
        description: 'Lista autores ativos ordenados por nome.',
        response: { 200: authorListResponseSchema }
      }
    },
    listAuthors
  );

  fastify.get(
    '/:id',
    {
      schema: {
        tags: ['Authors'],
        summary: 'Busca autor',
        description: 'Busca um autor ativo por id UUID.',
        params: authorIdParamsSchema,
        response: authorRouteResponses
      }
    },
    getAuthor
  );

  fastify.post(
    '/',
    {
      schema: {
        tags: ['Authors'],
        summary: 'Cria autor',
        description: 'Cria um autor ou especialista.',
        body: createAuthorBodySchema,
        response: authorRouteResponses
      }
    },
    createAuthor
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        tags: ['Authors'],
        summary: 'Atualiza autor',
        description: 'Atualiza parcialmente um autor existente.',
        params: authorIdParamsSchema,
        body: updateAuthorBodySchema,
        response: authorRouteResponses
      }
    },
    updateAuthor
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        tags: ['Authors'],
        summary: 'Remove autor',
        description: 'Remove logicamente um autor. Autores com artigos ativos nao podem ser removidos.',
        params: authorIdParamsSchema,
        response: { 204: { type: 'null' }, 404: errorResponseSchema, 409: errorResponseSchema }
      }
    },
    deleteAuthor
  );
};
