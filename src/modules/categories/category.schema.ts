import { commonErrorResponses, idOrSlugSchema, slugSchema, uuidSchema } from '../../shared/schemas/common.schemas';

export const categorySchema = {
  description: 'Categoria editorial usada para organizar artigos.',
  examples: [
    {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Saude Menstrual',
      slug: 'saude-menstrual',
      description: 'Conteudos sobre ciclo menstrual e sintomas relacionados.',
      displayOrder: 1,
      createdAt: '2026-05-12T00:00:00.000Z',
      updatedAt: '2026-05-12T00:00:00.000Z'
    }
  ],
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
  description: 'Dados para criar uma categoria.',
  examples: [
    {
      name: 'Saude Menstrual',
      slug: 'saude-menstrual',
      description: 'Conteudos sobre ciclo menstrual e sintomas relacionados.',
      displayOrder: 1
    }
  ],
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
  description: 'Dados para atualizar parcialmente uma categoria.',
  examples: [
    {
      name: 'Saude Menstrual e Ciclo'
    }
  ],
  type: 'object',
  minProperties: 1,
  additionalProperties: false,
  properties: createCategoryBodySchema.properties
} as const;

export const categoryIdParamsSchema = {
  description: 'Parametros de rota para operacoes por id de categoria.',
  type: 'object',
  required: ['id'],
  additionalProperties: false,
  properties: {
    id: uuidSchema
  }
} as const;

export const categoryIdOrSlugParamsSchema = {
  description: 'Parametros de rota para buscar categoria por id ou slug.',
  type: 'object',
  required: ['idOrSlug'],
  additionalProperties: false,
  properties: {
    idOrSlug: idOrSlugSchema
  }
} as const;

export const categoryListResponseSchema = {
  description: 'Lista de categorias ativas.',
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
