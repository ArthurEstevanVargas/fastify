import type { FastifyInstance } from 'fastify';

export const registerHealthRoute = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get(
    '/health',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            required: ['status', 'database'],
            additionalProperties: false,
            properties: {
              status: { type: 'string' },
              database: { type: 'string' }
            }
          },
          503: {
            type: 'object',
            required: ['status', 'database'],
            additionalProperties: false,
            properties: {
              status: { type: 'string' },
              database: { type: 'string' }
            }
          }
        }
      }
    },
    async (_request, reply) => {
      if (!fastify.db.isAvailable()) {
        return reply.status(503).send({ status: 'error', database: 'unavailable' });
      }

      await fastify.db.query('SELECT 1');
      return reply.status(200).send({ status: 'ok', database: 'ok' });
    }
  );
};
