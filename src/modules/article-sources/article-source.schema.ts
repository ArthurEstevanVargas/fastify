import { commonErrorResponses, uuidSchema } from '../../shared/schemas/common.schemas';

export const articleSourceSchema = {
  description: 'Fonte bibliografica ou referencia vinculada a um artigo.',
  examples: [
    {
      id: '00000000-0000-0000-0000-000000000004',
      articleId: '00000000-0000-0000-0000-000000000003',
      title: 'Ministerio da Saude - Saude da Mulher',
      description: 'Referencia institucional usada no artigo.',
      url: 'https://www.gov.br/saude',
      sourceOrder: 1,
      createdAt: '2026-05-12T00:00:00.000Z',
      updatedAt: '2026-05-12T00:00:00.000Z'
    }
  ],
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
  description: 'Dados para criar uma fonte de artigo.',
  examples: [
    {
      articleId: '00000000-0000-0000-0000-000000000003',
      title: 'Ministerio da Saude - Saude da Mulher',
      description: 'Referencia institucional usada no artigo.',
      url: 'https://www.gov.br/saude',
      sourceOrder: 1
    }
  ],
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
  description: 'Dados para atualizar parcialmente uma fonte de artigo.',
  examples: [
    {
      sourceOrder: 2
    }
  ],
  type: 'object',
  minProperties: 1,
  additionalProperties: false,
  properties: createArticleSourceBodySchema.properties
} as const;

export const articleSourceIdParamsSchema = {
  description: 'Parametros de rota para operacoes por id de fonte.',
  type: 'object',
  required: ['id'],
  additionalProperties: false,
  properties: {
    id: uuidSchema
  }
} as const;

export const articleSourceListQuerySchema = {
  description: 'Filtros opcionais para listar fontes de artigos.',
  type: 'object',
  additionalProperties: false,
  properties: {
    articleId: uuidSchema
  }
} as const;

export const articleSourceListResponseSchema = {
  description: 'Lista de fontes de artigos ativas.',
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
