import { commonErrorResponses, idOrSlugSchema, slugSchema, uuidSchema } from '../../shared/schemas/common.schemas';

export const categorySchema = {
  type: 'object',
  required: ['id', 'name', 'slug', 'description', 'displayOrder', 'createdAt', 'updatedAt'],
  additionalProperties: false,
  properties: {
    id: uuidSchema,
    name: { type: 'string' },
    slug: slugSchema,
    description: { type: 'string' },
    displayOrder: { type: 'integer' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
} as const;

export const createCategoryBodySchema = {
  type: 'object',
  required: ['name', 'slug', 'description'],
  additionalProperties: false,
  properties: {
    name: { type: 'string', minLength: 1 },
    slug: slugSchema,
    description: { type: 'string', minLength: 1 },
    displayOrder: { type: 'integer', minimum: 0 }
  }
} as const;

export const updateCategoryBodySchema = {
  type: 'object',
  minProperties: 1,
  additionalProperties: false,
  properties: createCategoryBodySchema.properties
} as const;

export const categoryIdParamsSchema = {
  type: 'object',
  required: ['id'],
  additionalProperties: false,
  properties: {
    id: uuidSchema
  }
} as const;

export const categoryIdOrSlugParamsSchema = {
  type: 'object',
  required: ['idOrSlug'],
  additionalProperties: false,
  properties: {
    idOrSlug: idOrSlugSchema
  }
} as const;

export const categoryListResponseSchema = {
  type: 'object',
  required: ['data'],
  additionalProperties: false,
  properties: {
    data: {
      type: 'array',
      items: categorySchema
    }
  }
} as const;

export const categoryRouteResponses = {
  ...commonErrorResponses,
  200: categorySchema,
  201: categorySchema
} as const;
