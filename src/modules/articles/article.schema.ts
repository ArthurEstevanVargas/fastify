import { articleSourceSchema } from '../article-sources/article-source.schema';
import { commonErrorResponses, idOrSlugSchema, slugSchema, uuidSchema } from '../../shared/schemas/common.schemas';

const categorySummarySchema = {
  type: 'object',
  required: ['id', 'name', 'slug'],
  additionalProperties: false,
  properties: {
    id: uuidSchema,
    name: { type: 'string' },
    slug: slugSchema
  }
} as const;

const authorSummarySchema = {
  type: 'object',
  required: ['id', 'name'],
  additionalProperties: false,
  properties: {
    id: uuidSchema,
    name: { type: 'string' }
  }
} as const;

const articleBaseProperties = {
  id: uuidSchema,
  title: { type: 'string' },
  slug: slugSchema,
  summary: { type: 'string' },
  status: { type: 'string', enum: ['draft', 'published', 'archived'] },
  isFeatured: { type: 'boolean' },
  publishedAt: { type: ['string', 'null'], format: 'date-time' }
} as const;

export const articleListItemSchema = {
  description: 'Resumo de artigo retornado em listagens publicas.',
  examples: [
    {
      id: '00000000-0000-0000-0000-000000000003',
      title: 'Como acompanhar o ciclo menstrual',
      slug: 'como-acompanhar-o-ciclo-menstrual',
      summary: 'Orientacoes praticas para acompanhar sinais do ciclo.',
      status: 'published',
      isFeatured: true,
      publishedAt: '2026-05-12T00:00:00.000Z',
      category: {
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Saude Menstrual',
        slug: 'saude-menstrual'
      },
      author: {
        id: '00000000-0000-0000-0000-000000000002',
        name: 'Dra. Ana Silva'
      }
    }
  ],
  type: 'object',
  required: ['id', 'title', 'slug', 'summary', 'status', 'isFeatured', 'publishedAt', 'category', 'author'],
  additionalProperties: false,
  properties: {
    ...articleBaseProperties,
    category: categorySummarySchema,
    author: authorSummarySchema
  }
} as const;

export const articleDetailSchema = {
  description: 'Detalhe completo de artigo publicado, incluindo categoria, autor e fontes.',
  type: 'object',
  required: [
    'id',
    'categoryId',
    'authorId',
    'title',
    'slug',
    'summary',
    'content',
    'status',
    'isFeatured',
    'publishedAt',
    'createdAt',
    'updatedAt',
    'category',
    'author',
    'sources'
  ],
  additionalProperties: false,
  properties: {
    ...articleBaseProperties,
    categoryId: uuidSchema,
    authorId: uuidSchema,
    content: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    category: categorySummarySchema,
    author: {
      type: 'object',
      required: ['id', 'name', 'institution', 'credentials'],
      additionalProperties: false,
      properties: {
        id: uuidSchema,
        name: { type: 'string' },
        institution: { type: ['string', 'null'] },
        credentials: { type: ['string', 'null'] }
      }
    },
    sources: {
      type: 'array',
      items: articleSourceSchema
    }
  }
} as const;

const paginationMetaSchema = {
  type: 'object',
  required: ['page', 'pageSize', 'total', 'totalPages'],
  additionalProperties: false,
  properties: {
    page: { type: 'integer' },
    pageSize: { type: 'integer' },
    total: { type: 'integer' },
    totalPages: { type: 'integer' }
  }
} as const;

export const articleListResponseSchema = {
  description: 'Lista paginada de artigos publicados.',
  type: 'object',
  required: ['data', 'pagination'],
  additionalProperties: false,
  properties: {
    data: { type: 'array', items: articleListItemSchema },
    pagination: paginationMetaSchema
  }
} as const;

export const articleListQuerySchema = {
  description: 'Filtros e paginacao para listagem de artigos publicados.',
  type: 'object',
  additionalProperties: false,
  properties: {
    page: { type: 'integer', minimum: 1, default: 1 },
    pageSize: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
    categoryId: uuidSchema,
    categorySlug: slugSchema,
    authorId: uuidSchema,
    status: { type: 'string', enum: ['draft', 'published', 'archived'] },
    featured: { type: 'boolean' }
  }
} as const;

export const articleSearchQuerySchema = {
  description: 'Parametros para busca textual de artigos publicados.',
  type: 'object',
  required: ['q'],
  additionalProperties: false,
  properties: {
    q: { type: 'string', minLength: 1 },
    page: { type: 'integer', minimum: 1, default: 1 },
    pageSize: { type: 'integer', minimum: 1, maximum: 100, default: 20 }
  }
} as const;

export const createArticleBodySchema = {
  description: 'Dados para criar um artigo.',
  examples: [
    {
      categoryId: '00000000-0000-0000-0000-000000000001',
      authorId: '00000000-0000-0000-0000-000000000002',
      title: 'Como acompanhar o ciclo menstrual',
      slug: 'como-acompanhar-o-ciclo-menstrual',
      summary: 'Orientacoes praticas para acompanhar sinais do ciclo.',
      content: 'Conteudo completo do artigo.',
      status: 'published',
      isFeatured: true,
      publishedAt: '2026-05-12T00:00:00.000Z'
    }
  ],
  type: 'object',
  required: ['categoryId', 'authorId', 'title', 'slug', 'summary', 'content'],
  additionalProperties: false,
  properties: {
    categoryId: uuidSchema,
    authorId: uuidSchema,
    title: { type: 'string', minLength: 1 },
    slug: slugSchema,
    summary: { type: 'string', minLength: 1 },
    content: { type: 'string', minLength: 1 },
    status: { type: 'string', enum: ['draft', 'published', 'archived'] },
    isFeatured: { type: 'boolean' },
    publishedAt: { type: ['string', 'null'], format: 'date-time' }
  }
} as const;

export const updateArticleBodySchema = {
  description: 'Dados para atualizar parcialmente um artigo.',
  examples: [
    {
      isFeatured: false
    }
  ],
  type: 'object',
  minProperties: 1,
  additionalProperties: false,
  properties: createArticleBodySchema.properties
} as const;

export const articleIdParamsSchema = {
  description: 'Parametros de rota para operacoes por id de artigo.',
  type: 'object',
  required: ['id'],
  additionalProperties: false,
  properties: { id: uuidSchema }
} as const;

export const articleIdOrSlugParamsSchema = {
  description: 'Parametros de rota para buscar artigo por id ou slug.',
  type: 'object',
  required: ['idOrSlug'],
  additionalProperties: false,
  properties: { idOrSlug: idOrSlugSchema }
} as const;

export const articleRouteResponses = {
  ...commonErrorResponses,
  200: articleDetailSchema,
  201: articleDetailSchema
} as const;
