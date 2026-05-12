import type { FastifyReply, FastifyRequest } from 'fastify';
import { ArticleSourceRepository } from './article-source.repository';
import { ArticleSourceService } from './article-source.service';
import type { CreateArticleSourceInput, UpdateArticleSourceInput } from './article-source.types';

type IdParams = { id: string };
type ListQuery = { articleId?: string };

const makeService = (request: FastifyRequest): ArticleSourceService => {
  return new ArticleSourceService(new ArticleSourceRepository(request.server.db), request.server.db);
};

export const listArticleSources = async (
  request: FastifyRequest<{ Querystring: ListQuery }>
): Promise<{ data: unknown[] }> => {
  const sources = await makeService(request).list(request.query.articleId);
  return { data: sources };
};

export const getArticleSource = async (request: FastifyRequest<{ Params: IdParams }>): Promise<unknown> => {
  return makeService(request).get(request.params.id);
};

export const createArticleSource = async (
  request: FastifyRequest<{ Body: CreateArticleSourceInput }>,
  reply: FastifyReply
): Promise<unknown> => {
  const source = await makeService(request).create(request.body);
  return reply.status(201).send(source);
};

export const updateArticleSource = async (
  request: FastifyRequest<{ Params: IdParams; Body: UpdateArticleSourceInput }>
): Promise<unknown> => {
  return makeService(request).update(request.params.id, request.body);
};

export const deleteArticleSource = async (
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply
): Promise<void> => {
  await makeService(request).remove(request.params.id);
  return reply.status(204).send();
};
