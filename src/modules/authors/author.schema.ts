import { commonErrorResponses, uuidSchema } from '../../shared/schemas/common.schemas';

export const authorSchema = {
  description: 'Autor ou especialista responsavel por artigos.',
  examples: [
    {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Dra. Ana Silva',
      institution: 'Clinica Exemplo',
      bio: 'Ginecologista com foco em saude feminina.',
      credentials: 'CRM 00000',
      createdAt: '2026-05-12T00:00:00.000Z',
      updatedAt: '2026-05-12T00:00:00.000Z'
    }
  ],
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
  description: 'Dados para criar um autor.',
  examples: [
    {
      name: 'Dra. Ana Silva',
      institution: 'Clinica Exemplo',
      bio: 'Ginecologista com foco em saude feminina.',
      credentials: 'CRM 00000'
    }
  ],
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
  description: 'Dados para atualizar parcialmente um autor.',
  examples: [
    {
      institution: 'Hospital Exemplo'
    }
  ],
  type: 'object',
  minProperties: 1,
  additionalProperties: false,
  properties: createAuthorBodySchema.properties
} as const;

export const authorIdParamsSchema = {
  description: 'Parametros de rota para operacoes por id de autor.',
  type: 'object',
  required: ['id'],
  additionalProperties: false,
  properties: {
    id: uuidSchema
  }
} as const;

export const authorListResponseSchema = {
  description: 'Lista de autores ativos.',
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
