import type { FastifyReply, FastifyRequest } from 'fastify';
import { AuthorRepository } from './author.repository';
import { AuthorService } from './author.service';
import type { CreateAuthorInput, UpdateAuthorInput } from './author.types';

type IdParams = { id: string };

const makeService = (request: FastifyRequest): AuthorService => {
  return new AuthorService(new AuthorRepository(request.server.db));
};

export const listAuthors = async (request: FastifyRequest): Promise<{ data: unknown[] }> => {
  const authors = await makeService(request).list();
  return { data: authors };
};

export const getAuthor = async (request: FastifyRequest<{ Params: IdParams }>): Promise<unknown> => {
  return makeService(request).get(request.params.id);
};

export const createAuthor = async (
  request: FastifyRequest<{ Body: CreateAuthorInput }>,
  reply: FastifyReply
): Promise<unknown> => {
  const author = await makeService(request).create(request.body);
  return reply.status(201).send(author);
};

export const updateAuthor = async (
  request: FastifyRequest<{ Params: IdParams; Body: UpdateAuthorInput }>
): Promise<unknown> => {
  return makeService(request).update(request.params.id, request.body);
};

export const deleteAuthor = async (
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply
): Promise<void> => {
  await makeService(request).remove(request.params.id);
  return reply.status(204).send();
};
