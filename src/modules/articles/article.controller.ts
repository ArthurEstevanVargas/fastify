import type { FastifyReply, FastifyRequest } from 'fastify';
import { ArticleRepository } from './article.repository';
import { ArticleService } from './article.service';
import type { ArticleListQuery, ArticleSearchQuery, CreateArticleInput, UpdateArticleInput } from './article.types';

type IdParams = { id: string };
type IdOrSlugParams = { idOrSlug: string };

const makeService = (request: FastifyRequest): ArticleService => {
  return new ArticleService(new ArticleRepository(request.server.db), request.server.db);
};

export const listArticles = async (request: FastifyRequest<{ Querystring: ArticleListQuery }>): Promise<unknown> => {
  return makeService(request).list(request.query);
};

export const listFeaturedArticles = async (
  request: FastifyRequest<{ Querystring: ArticleListQuery }>
): Promise<unknown> => {
  return makeService(request).featured(request.query);
};

export const searchArticles = async (
  request: FastifyRequest<{ Querystring: ArticleSearchQuery }>
): Promise<unknown> => {
  return makeService(request).search(request.query);
};

export const getArticle = async (request: FastifyRequest<{ Params: IdOrSlugParams }>): Promise<unknown> => {
  return makeService(request).get(request.params.idOrSlug);
};

export const createArticle = async (
  request: FastifyRequest<{ Body: CreateArticleInput }>,
  reply: FastifyReply
): Promise<unknown> => {
  const article = await makeService(request).create(request.body);
  return reply.status(201).send(article);
};

export const updateArticle = async (
  request: FastifyRequest<{ Params: IdParams; Body: UpdateArticleInput }>
): Promise<unknown> => {
  return makeService(request).update(request.params.id, request.body);
};

export const deleteArticle = async (
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply
): Promise<void> => {
  await makeService(request).remove(request.params.id);
  return reply.status(204).send();
};
