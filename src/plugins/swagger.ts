import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

export const registerSwagger = fp(
  async (fastify: FastifyInstance): Promise<void> => {
    await fastify.register(swagger, {
      openapi: {
        openapi: '3.0.3',
        info: {
          title: 'Minha Saude Feminina API',
          description: 'API REST para conteudos de saude da mulher, categorias, autores, artigos e fontes.',
          version: '1.0.0'
        },
        tags: [
          { name: 'Health', description: 'Status da aplicacao e dependencias.' },
          { name: 'Categories', description: 'Categorias editoriais dos artigos.' },
          { name: 'Authors', description: 'Autores e especialistas responsaveis pelos conteudos.' },
          { name: 'Articles', description: 'Artigos publicados e rotas administrativas de conteudo.' },
          { name: 'Article Sources', description: 'Fontes e referencias vinculadas aos artigos.' }
        ],
        components: {
          securitySchemes: {
            AdminApiKey: {
              type: 'apiKey',
              in: 'header',
              name: 'x-api-key',
              description: 'Chave administrativa configurada em ADMIN_API_KEY.'
            },
            AdminBearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'API key',
              description: 'Chave administrativa enviada como Authorization: Bearer <token>.'
            }
          }
        }
      }
    });

    await fastify.register(swaggerUi, {
      routePrefix: '/docs',
      staticCSP: true,
      uiConfig: {
        deepLinking: true,
        docExpansion: 'list',
        persistAuthorization: true
      }
    });
  },
  {
    name: 'swagger'
  }
);
