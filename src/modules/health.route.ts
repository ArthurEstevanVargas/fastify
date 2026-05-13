import type { FastifyInstance } from 'fastify';

export const registerHealthRoute = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get(
    '/health',
    {
      schema: {
        description: 'Verifica se a aplicacao esta ativa e se o banco de dados esta disponivel.',
        tags: ['Health'],
        response: {
          200: {
            description: 'Aplicacao e banco de dados disponiveis.',
            type: 'object',
            examples: [{ status: 'ok', database: 'ok' }],
            required: ['status', 'database'],
            additionalProperties: false,
            properties: {
              status: { type: 'string' },
              database: { type: 'string' }
            }
          },
          503: {
            description: 'Banco de dados indisponivel ou nao configurado.',
            type: 'object',
            examples: [{ status: 'error', database: 'unavailable' }],
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
