import { commonErrorResponses, uuidSchema } from '../../shared/schemas/common.schemas';

export const articleSourceSchema = {
  type: 'object',
  required: ['id', 'articleId', 'title', 'description', 'url', 'sourceOrder', 'createdAt', 'updatedAt'],
  additionalProperties: false,
  properties: {
    id: uuidSchema,
    articleId: uuidSchema,
    title: { type: 'string' },
    description: { type: ['string', 'null'] },
    url: { type: ['string', 'null'], format: 'uri' },
    sourceOrder: { type: 'integer' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
} as const;

export const createArticleSourceBodySchema = {
  type: 'object',
  required: ['articleId', 'title'],
  additionalProperties: false,
  properties: {
    articleId: uuidSchema,
    title: { type: 'string', minLength: 1 },
    description: { type: ['string', 'null'] },
    url: { type: ['string', 'null'], format: 'uri' },
    sourceOrder: { type: 'integer', minimum: 0 }
  }
} as const;

export const updateArticleSourceBodySchema = {
  type: 'object',
  minProperties: 1,
  additionalProperties: false,
  properties: createArticleSourceBodySchema.properties
} as const;

export const articleSourceIdParamsSchema = {
  type: 'object',
  required: ['id'],
  additionalProperties: false,
  properties: {
    id: uuidSchema
  }
} as const;

export const articleSourceListQuerySchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    articleId: uuidSchema
  }
} as const;

export const articleSourceListResponseSchema = {
  type: 'object',
  required: ['data'],
  additionalProperties: false,
  properties: {
    data: {
      type: 'array',
      items: articleSourceSchema
    }
  }
} as const;

export const articleSourceRouteResponses = {
  ...commonErrorResponses,
  200: articleSourceSchema,
  201: articleSourceSchema
} as const;
