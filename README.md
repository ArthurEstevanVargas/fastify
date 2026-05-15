# Minha Saúde Feminina API

API REST para o projeto **Minha Saúde Feminina**, uma plataforma de educação em saúde da mulher com conteúdos organizados por categorias, autores, artigos e fontes de referência.

O objetivo desta API é servir como backend do MVP, centralizando a curadoria e o consumo de conteúdos confiáveis sobre temas como saúde menstrual, saúde sexual, gravidez, pós-parto, prevenção e menopausa.

## O que é o projeto

Este repositório contém a API backend de uma plataforma de conteúdo, desenvolvida com Node.js, TypeScript, Fastify e PostgreSQL.

- listar categorias temáticas;
- listar, buscar e destacar artigos publicados;
- consultar autores e fontes dos artigos;
- criar, atualizar e remover logicamente conteúdos por rotas administrativas;
- verificar a saúde da aplicação e da conexão com o banco.

As rotas públicas de leitura retornam apenas conteúdos publicados e não removidos logicamente. As rotas de escrita exigem uma chave administrativa via `ADMIN_API_KEY`.

## Stack

- Node.js 22
- TypeScript
- Fastify 5
- PostgreSQL
- Vitest
- Pino, via logger nativo do Fastify

## Estrutura principal

```text
src/
  app.ts                         # Configuração da aplicação Fastify
  server.ts                      # Inicialização do servidor HTTP
  config/env.ts                  # Leitura e validação de variáveis de ambiente
  plugins/                       # Plugins de banco, erros, auth e utilidades
  modules/                       # Módulos de domínio e rotas da API
  infra/database/                # Migrações e seeds SQL
  shared/                        # Erros, schemas e helpers compartilhados
docs/
  api/                           # Documentação de rotas, exemplos e erros
  database/                      # Modelo de dados e decisões de banco
test/
  unit/                          # Testes unitários
  integration/                   # Testes de integração
```

## Variáveis de ambiente

Crie um arquivo `.env` a partir de `.env.example`:

```bash
cp .env.example .env
```

Variáveis usadas pela aplicação:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/minha_saude_feminina
ADMIN_API_KEY=change-me-local-admin-api-key-32chars
CORS_ORIGINS=http://localhost:8081
PORT=3000
NODE_ENV=development
```

Observações:

- `DATABASE_URL` é obrigatória para rodar migrações, seeds e para produção.
- `ADMIN_API_KEY` precisa ter pelo menos 32 caracteres quando definida.
- Em produção, `DATABASE_URL` e `ADMIN_API_KEY` são obrigatórias.
- `CORS_ORIGINS` aceita múltiplas origens separadas por vírgula.

## Como rodar localmente

Instale as dependências:

```bash
npm ci
```

Com o PostgreSQL disponível e o `.env` configurado, rode as migrações:

```bash
npm run migrate
```

Popule os dados iniciais:

```bash
npm run seed
```

Inicie o servidor em modo desenvolvimento:

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3000
```

Documentacao Swagger/OpenAPI:

```text
http://localhost:3000/docs
http://localhost:3000/docs/json
http://localhost:3000/docs/yaml
```

Verifique a saúde da aplicação:

```bash
curl http://localhost:3000/health
```

Resposta esperada quando a aplicação e o banco estiverem disponíveis:

```json
{
  "status": "ok",
  "database": "ok"
}
```

## Scripts

```bash
npm run dev        # inicia o servidor com nodemon e tsx
npm run build      # compila TypeScript para dist/
npm start          # executa dist/server.js
npm test           # roda a suíte de testes com Vitest
npm run migrate    # aplica arquivos SQL de migração
npm run seed       # aplica arquivos SQL de seed
```

## Recursos da API

Prefixo principal das rotas de negócio:

```text
/api/v1
```

Rotas principais:

- `GET /health`
- `GET /api/v1/categories`
- `GET /api/v1/categories/:idOrSlug`
- `GET /api/v1/authors`
- `GET /api/v1/authors/:id`
- `GET /api/v1/articles`
- `GET /api/v1/articles/featured`
- `GET /api/v1/articles/search?q=termo`
- `GET /api/v1/articles/:idOrSlug`
- `GET /api/v1/article-sources`
- `GET /api/v1/article-sources/:id`

Rotas mutáveis (`POST`, `PATCH`, `DELETE`) existem para categorias, autores, artigos e fontes de artigos. Elas exigem autenticação administrativa.

## Autenticação administrativa

Para acessar endpoints de escrita, envie a chave configurada em `ADMIN_API_KEY` por um destes formatos:

```http
x-api-key: sua-chave-administrativa
```

ou:

```http
Authorization: Bearer sua-chave-administrativa
```

Sem a chave correta, a API responde com `401 UNAUTHORIZED`. Se a chave administrativa não estiver configurada, rotas administrativas respondem com `503 ADMIN_API_KEY_NOT_CONFIGURED`.

## Banco de dados

O modelo atual possui as entidades:

- `categories`
- `authors`
- `articles`
- `article_sources`

Os registros usam remoção lógica quando aplicável, slugs únicos para itens ativos, índices para buscas e relacionamentos por chaves estrangeiras.

Mais detalhes estão em:

- [docs/database/entities.md](docs/database/entities.md)
- [docs/database/schema.sql](docs/database/schema.sql)
- [docs/database/decisions.md](docs/database/decisions.md)

## Documentação adicional

- [docs/api/README.md](docs/api/README.md)
- [docs/api/routes.md](docs/api/routes.md)
- [docs/api/examples.md](docs/api/examples.md)
- [docs/api/errors.md](docs/api/errors.md)
- [docs/api-security.md](docs/api-security.md)

## Testes

Rode a suíte automatizada com:

```bash
npm test
```

Os testes cobrem helpers compartilhados, regras de serviço, schema do banco e integração básica das rotas de saúde e autenticação administrativa.

## Licença

Este projeto está licenciado sob a licença MIT. Consulte [LICENSE](LICENSE).
