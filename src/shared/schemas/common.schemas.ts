export const errorResponseSchema = {
  description: 'Resposta padrao para erros tratados pela API.',
  examples: [
    {
      error: true,
      message: 'Dados invalidos',
      code: 'VALIDATION_ERROR'
    }
  ],
  type: 'object',
  required: ['error', 'message', 'code'],
  additionalProperties: false,
  properties: {
    error: { type: 'boolean', const: true },
    message: { type: 'string' },
    code: { type: 'string' }
  }
} as const;

export const uuidSchema = {
  type: 'string',
  format: 'uuid'
} as const;

export const slugSchema = {
  type: 'string',
  minLength: 1,
  pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$'
} as const;

export const idOrSlugSchema = {
  type: 'string',
  minLength: 1
} as const;

export const paginationQuerySchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    page: { type: 'integer', minimum: 1, default: 1 },
    pageSize: { type: 'integer', minimum: 1, maximum: 100, default: 20 }
  }
} as const;

export const commonErrorResponses = {
  400: errorResponseSchema,
  401: errorResponseSchema,
  404: errorResponseSchema,
  409: errorResponseSchema,
  503: errorResponseSchema,
  500: errorResponseSchema
} as const;

export const adminRouteSecurity = [{ AdminApiKey: [] }, { AdminBearerAuth: [] }] as const;
