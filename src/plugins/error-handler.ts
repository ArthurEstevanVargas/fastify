import fp from 'fastify-plugin';
import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../shared/errors/app-error';

export default fp(async (fastify) => {
  fastify.setErrorHandler((error: FastifyError | AppError, request: FastifyRequest, reply: FastifyReply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        error: true,
        message: error.message,
        code: error.code
      });
    }

    if ('validation' in error && error.validation) {
      return reply.status(400).send({
        error: true,
        message: 'Dados inválidos',
        code: 'VALIDATION_ERROR'
      });
    }

    request.log.error({ err: error }, 'Unhandled request error');

    return reply.status(500).send({
      error: true,
      message: 'Erro interno',
      code: 'INTERNAL_SERVER_ERROR'
    });
  });
});
