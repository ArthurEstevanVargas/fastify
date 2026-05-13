# Erros da API

## Formato Padrao

Erros tratados retornam JSON no formato:

```json
{
  "error": true,
  "message": "Dados invalidos",
  "code": "VALIDATION_ERROR"
}
```

Campos:

- `error`: sempre `true`.
- `message`: mensagem legivel para depuracao ou exibicao controlada.
- `code`: codigo estavel para tratamento programatico.

## Status HTTP

### 400 Bad Request

Entrada invalida, body vazio em atualizacao parcial, query invalida ou regra de validacao de publicacao violada.

Codigos conhecidos:

- `VALIDATION_ERROR`

Exemplo:

```json
{
  "error": true,
  "message": "Artigos publicados exigem publishedAt",
  "code": "VALIDATION_ERROR"
}
```

### 404 Not Found

Recurso nao encontrado ou removido logicamente.

Codigos conhecidos:

- `CATEGORY_NOT_FOUND`
- `AUTHOR_NOT_FOUND`
- `ARTICLE_NOT_FOUND`
- `ARTICLE_SOURCE_NOT_FOUND`
- `ARTICLE_SOURCE_ARTICLE_NOT_FOUND`
- `NOT_FOUND`

### 409 Conflict

Operacao conflita com estado atual dos dados.

Codigos conhecidos:

- `SLUG_ALREADY_EXISTS`
- `CATEGORY_HAS_ARTICLES`
- `AUTHOR_HAS_ARTICLES`
- `CONFLICT`

### 500 Internal Server Error

Erro nao tratado na aplicacao.

Codigo:

- `INTERNAL_SERVER_ERROR`

### 503 Service Unavailable

Banco indisponivel na rota de health.

Observacao: `GET /health` retorna `{ "status": "error", "database": "unavailable" }`, nao o envelope padrao de erro.

## Validacao

As rotas usam JSON Schema do Fastify:

- Campos extras sao rejeitados quando `additionalProperties: false`.
- UUIDs precisam estar em formato valido.
- Slugs devem usar letras minusculas, numeros e hifens.
- `page` deve ser inteiro maior ou igual a `1`.
- `pageSize` deve ser inteiro entre `1` e `100`.
- Bodies de `PATCH` exigem pelo menos um campo.

## Tratamento Recomendado no Cliente

```ts
if (!response.ok) {
  const error = await response.json();

  switch (error.code) {
    case 'VALIDATION_ERROR':
      break;
    case 'SLUG_ALREADY_EXISTS':
      break;
    case 'ARTICLE_NOT_FOUND':
      break;
    default:
      break;
  }
}
```
