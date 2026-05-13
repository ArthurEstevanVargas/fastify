# Rotas da API

Base local: `http://localhost:3000`.

## Health

### GET /health

Verifica se a aplicacao esta ativa e se o banco esta disponivel.

- Parametros de rota: nenhum.
- Query params: nenhum.
- Body: nenhum.
- Sucesso `200`:

```json
{
  "status": "ok",
  "database": "ok"
}
```

- Erros: `503` quando `DATABASE_URL` nao esta configurado ou o banco esta indisponivel.

## Categorias

### GET /api/v1/categories

Lista categorias ativas ordenadas por `displayOrder` e `name`.

- Query params: nenhum.
- Body: nenhum.
- Sucesso `200`: `{ "data": Category[] }`.

### GET /api/v1/categories/:idOrSlug

Busca categoria ativa por UUID ou slug.

- Parametros de rota: `idOrSlug` string.
- Query params: nenhum.
- Body: nenhum.
- Sucesso `200`: `Category`.
- Erros: `404 CATEGORY_NOT_FOUND`.

### POST /api/v1/categories

Cria categoria.

- Body:

```json
{
  "name": "Saude Menstrual",
  "slug": "saude-menstrual",
  "description": "Conteudos sobre ciclo menstrual.",
  "displayOrder": 1
}
```

- Obrigatorios: `name`, `slug`, `description`.
- Sucesso `201`: `Category`.
- Erros: `400 VALIDATION_ERROR`, `409 SLUG_ALREADY_EXISTS`.
- Observacoes: `displayOrder` assume `0` quando omitido; `slug` deve seguir o padrao `^[a-z0-9]+(?:-[a-z0-9]+)*$`.

### PATCH /api/v1/categories/:id

Atualiza parcialmente uma categoria.

- Parametros de rota: `id` UUID.
- Body: qualquer campo de criacao, com pelo menos um campo.
- Sucesso `200`: `Category`.
- Erros: `400 VALIDATION_ERROR`, `404 CATEGORY_NOT_FOUND`, `409 SLUG_ALREADY_EXISTS`.

### DELETE /api/v1/categories/:id

Remove logicamente uma categoria.

- Parametros de rota: `id` UUID.
- Body: nenhum.
- Sucesso `204`: sem corpo.
- Erros: `404 CATEGORY_NOT_FOUND`, `409 CATEGORY_HAS_ARTICLES`.
- Observacoes: categorias com artigos ativos nao podem ser removidas.

## Autores

### GET /api/v1/authors

Lista autores ativos ordenados por nome.

- Query params: nenhum.
- Body: nenhum.
- Sucesso `200`: `{ "data": Author[] }`.

### GET /api/v1/authors/:id

Busca autor por UUID.

- Parametros de rota: `id` UUID.
- Sucesso `200`: `Author`.
- Erros: `404 AUTHOR_NOT_FOUND`.

### POST /api/v1/authors

Cria autor.

- Body:

```json
{
  "name": "Dra. Ana Silva",
  "institution": "Clinica Exemplo",
  "bio": "Ginecologista com foco em saude feminina.",
  "credentials": "CRM 00000"
}
```

- Obrigatorio: `name`.
- Sucesso `201`: `Author`.
- Erros: `400 VALIDATION_ERROR`.

### PATCH /api/v1/authors/:id

Atualiza parcialmente um autor.

- Parametros de rota: `id` UUID.
- Body: qualquer campo de criacao, com pelo menos um campo.
- Sucesso `200`: `Author`.
- Erros: `400 VALIDATION_ERROR`, `404 AUTHOR_NOT_FOUND`.

### DELETE /api/v1/authors/:id

Remove logicamente um autor.

- Parametros de rota: `id` UUID.
- Sucesso `204`: sem corpo.
- Erros: `404 AUTHOR_NOT_FOUND`, `409 AUTHOR_HAS_ARTICLES`.
- Observacoes: autores com artigos ativos nao podem ser removidos.

## Artigos

### GET /api/v1/articles

Lista artigos publicados, paginados e ordenados por publicacao.

- Query params: `page`, `pageSize`, `categoryId`, `categorySlug`, `authorId`, `status`, `featured`.
- Body: nenhum.
- Sucesso `200`: `{ "data": ArticleListItem[], "pagination": Pagination }`.
- Observacoes: apesar de `status` estar no schema, a consulta publica retorna apenas `published`.

### GET /api/v1/articles/featured

Lista artigos publicados em destaque.

- Query params: mesmos filtros de `GET /api/v1/articles`.
- Sucesso `200`: lista paginada.
- Observacoes: a implementacao forca `featured=true`.

### GET /api/v1/articles/search

Busca artigos publicados por texto.

- Query params: `q` obrigatorio, `page`, `pageSize`.
- Sucesso `200`: lista paginada.
- Erros: `400 VALIDATION_ERROR`.

### GET /api/v1/articles/:idOrSlug

Busca detalhe de artigo publicado por UUID ou slug.

- Parametros de rota: `idOrSlug` string.
- Sucesso `200`: `ArticleDetail`, incluindo `category`, `author` e `sources`.
- Erros: `404 ARTICLE_NOT_FOUND`.

### POST /api/v1/articles

Cria artigo.

- Body:

```json
{
  "categoryId": "00000000-0000-0000-0000-000000000001",
  "authorId": "00000000-0000-0000-0000-000000000002",
  "title": "Como acompanhar o ciclo menstrual",
  "slug": "como-acompanhar-o-ciclo-menstrual",
  "summary": "Orientacoes praticas para acompanhar sinais do ciclo.",
  "content": "Conteudo completo do artigo.",
  "status": "draft",
  "isFeatured": false,
  "publishedAt": null
}
```

- Obrigatorios: `categoryId`, `authorId`, `title`, `slug`, `summary`, `content`.
- Sucesso `201`: `ArticleDetail`.
- Erros: `400 VALIDATION_ERROR`, `404 CATEGORY_NOT_FOUND`, `404 AUTHOR_NOT_FOUND`, `409 SLUG_ALREADY_EXISTS`.
- Observacoes: `status` assume `draft`; se `status` for `published`, `publishedAt` e obrigatorio.

### PATCH /api/v1/articles/:id

Atualiza parcialmente um artigo.

- Parametros de rota: `id` UUID.
- Body: qualquer campo de criacao, com pelo menos um campo.
- Sucesso `200`: `ArticleDetail`.
- Erros: `400 VALIDATION_ERROR`, `404 ARTICLE_NOT_FOUND`, `404 CATEGORY_NOT_FOUND`, `404 AUTHOR_NOT_FOUND`, `409 SLUG_ALREADY_EXISTS`.
- Observacoes: para publicar, envie `status: "published"` e `publishedAt`.

### DELETE /api/v1/articles/:id

Remove logicamente um artigo.

- Parametros de rota: `id` UUID.
- Sucesso `204`: sem corpo.
- Erros: `404 ARTICLE_NOT_FOUND`.

## Fontes de Artigos

### GET /api/v1/article-sources

Lista fontes ativas, opcionalmente filtradas por artigo.

- Query params: `articleId` UUID opcional.
- Sucesso `200`: `{ "data": ArticleSource[] }`.

### GET /api/v1/article-sources/:id

Busca fonte por UUID.

- Parametros de rota: `id` UUID.
- Sucesso `200`: `ArticleSource`.
- Erros: `404 ARTICLE_SOURCE_NOT_FOUND`.

### POST /api/v1/article-sources

Cria fonte de artigo.

- Body:

```json
{
  "articleId": "00000000-0000-0000-0000-000000000003",
  "title": "Ministerio da Saude - Saude da Mulher",
  "description": "Referencia institucional usada no artigo.",
  "url": "https://www.gov.br/saude",
  "sourceOrder": 1
}
```

- Obrigatorios: `articleId`, `title`.
- Sucesso `201`: `ArticleSource`.
- Erros: `400 VALIDATION_ERROR`, `404 ARTICLE_SOURCE_ARTICLE_NOT_FOUND`.

### PATCH /api/v1/article-sources/:id

Atualiza parcialmente uma fonte.

- Parametros de rota: `id` UUID.
- Body: qualquer campo de criacao, com pelo menos um campo.
- Sucesso `200`: `ArticleSource`.
- Erros: `400 VALIDATION_ERROR`, `404 ARTICLE_SOURCE_NOT_FOUND`, `404 ARTICLE_SOURCE_ARTICLE_NOT_FOUND`.

### DELETE /api/v1/article-sources/:id

Remove logicamente uma fonte.

- Parametros de rota: `id` UUID.
- Sucesso `204`: sem corpo.
- Erros: `404 ARTICLE_SOURCE_NOT_FOUND`.

## Modelos

`Category`: `id`, `name`, `slug`, `description`, `displayOrder`, `createdAt`, `updatedAt`.

`Author`: `id`, `name`, `institution`, `bio`, `credentials`, `createdAt`, `updatedAt`.

`ArticleListItem`: `id`, `title`, `slug`, `summary`, `status`, `isFeatured`, `publishedAt`, `category`, `author`.

`ArticleDetail`: campos de `ArticleListItem`, mais `categoryId`, `authorId`, `content`, `createdAt`, `updatedAt`, `sources`.

`ArticleSource`: `id`, `articleId`, `title`, `description`, `url`, `sourceOrder`, `createdAt`, `updatedAt`.
