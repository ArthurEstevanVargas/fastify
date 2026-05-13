import { timingSafeEqual } from 'node:crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { loadEnv } from '../config/env';

const getHeaderValue = (value: string | string[] | undefined): string | undefined => {
  return Array.isArray(value) ? value[0] : value;
};

const getRequestApiKey = (request: FastifyRequest): string | undefined => {
  const apiKey = getHeaderValue(request.headers['x-api-key']);
  const authorization = getHeaderValue(request.headers.authorization);

  if (apiKey) {
    return apiKey;
  }

  if (authorization?.startsWith('Bearer ')) {
    return authorization.slice('Bearer '.length);
  }

  return undefined;
};

const secureEquals = (candidate: string, expected: string): boolean => {
  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);

  return candidateBuffer.length === expectedBuffer.length && timingSafeEqual(candidateBuffer, expectedBuffer);
};

export const requireAdminApiKey = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const { adminApiKey } = loadEnv();

  if (!adminApiKey) {
    await reply.status(503).send({
      error: true,
      message: 'Admin API key is not configured',
      code: 'ADMIN_API_KEY_NOT_CONFIGURED'
    });
    return;
  }

  const requestApiKey = getRequestApiKey(request);

  if (!requestApiKey || !secureEquals(requestApiKey, adminApiKey)) {
    await reply.status(401).send({
      error: true,
      message: 'Authentication required',
      code: 'UNAUTHORIZED'
    });
  }
};
