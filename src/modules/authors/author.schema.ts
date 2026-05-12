import { commonErrorResponses, uuidSchema } from '../../shared/schemas/common.schemas';

export const authorSchema = {
  type: 'object',
  required: ['id', 'name', 'institution', 'bio', 'credentials', 'createdAt', 'updatedAt'],
  additionalProperties: false,
  properties: {
    id: uuidSchema,
    name: { type: 'string' },
    institution: { type: ['string', 'null'] },
    bio: { type: ['string', 'null'] },
    credentials: { type: ['string', 'null'] },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
} as const;

export const createAuthorBodySchema = {
  type: 'object',
  required: ['name'],
  additionalProperties: false,
  properties: {
    name: { type: 'string', minLength: 1 },
    institution: { type: ['string', 'null'] },
    bio: { type: ['string', 'null'] },
    credentials: { type: ['string', 'null'] }
  }
} as const;

export const updateAuthorBodySchema = {
  type: 'object',
  minProperties: 1,
  additionalProperties: false,
  properties: createAuthorBodySchema.properties
} as const;

export const authorIdParamsSchema = {
  type: 'object',
  required: ['id'],
  additionalProperties: false,
  properties: {
    id: uuidSchema
  }
} as const;

export const authorListResponseSchema = {
  type: 'object',
  required: ['data'],
  additionalProperties: false,
  properties: {
    data: {
      type: 'array',
      items: authorSchema
    }
  }
} as const;

export const authorRouteResponses = {
  ...commonErrorResponses,
  200: authorSchema,
  201: authorSchema
} as const;
