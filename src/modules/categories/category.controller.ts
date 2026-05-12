import type { FastifyReply, FastifyRequest } from 'fastify';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';
import type { CreateCategoryInput, UpdateCategoryInput } from './category.types';

type IdParams = { id: string };
type IdOrSlugParams = { idOrSlug: string };

const makeService = (request: FastifyRequest): CategoryService => {
  return new CategoryService(new CategoryRepository(request.server.db));
};

export const listCategories = async (request: FastifyRequest): Promise<{ data: unknown[] }> => {
  const categories = await makeService(request).list();
  return { data: categories };
};

export const getCategory = async (request: FastifyRequest<{ Params: IdOrSlugParams }>): Promise<unknown> => {
  return makeService(request).get(request.params.idOrSlug);
};

export const createCategory = async (
  request: FastifyRequest<{ Body: CreateCategoryInput }>,
  reply: FastifyReply
): Promise<unknown> => {
  const category = await makeService(request).create(request.body);
  return reply.status(201).send(category);
};

export const updateCategory = async (
  request: FastifyRequest<{ Params: IdParams; Body: UpdateCategoryInput }>
): Promise<unknown> => {
  return makeService(request).update(request.params.id, request.body);
};

export const deleteCategory = async (
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply
): Promise<void> => {
  await makeService(request).remove(request.params.id);
  return reply.status(204).send();
};
