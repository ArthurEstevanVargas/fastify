# Documentacao da API

API REST em Fastify para conteudos da plataforma Minha Saude Feminina. A API expoe recursos de categorias, autores, artigos e fontes de artigos.

## Visao Geral

- Formato de entrada e saida: JSON.
- Prefixo principal das rotas de negocio: `/api/v1`.
- Rotas de leitura de artigos retornam apenas artigos publicados e nao removidos logicamente.
- Rotas de escrita existem para curadoria e integracoes internas, mas ainda nao possuem autenticacao implementada.
- Erros tratados seguem o formato `{ "error": true, "message": "...", "code": "..." }`.

## URLs

Localmente, a URL base padrao e:

```text
http://localhost:3000
```

Em producao, substitua a origem local pela URL publicada da aplicacao, mantendo os mesmos paths:

```text
https://<dominio-da-api>/api/v1
```

## Como Rodar Localmente

1. Instale as dependencias:

```bash
npm ci
```

2. Configure as variaveis de ambiente a partir de `.env.example`:

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5432/minha_saude_feminina
PORT=3000
NODE_ENV=development
```

3. Rode migracoes e seeds quando o banco estiver disponivel:

```bash
npm run migrate
npm run seed
```

4. Inicie o servidor em modo desenvolvimento:

```bash
npm run dev
```

5. Verifique a saude da API:

```bash
curl http://localhost:3000/health
```

## Swagger/OpenAPI

Nao foi localizada configuracao Swagger/OpenAPI ativa no projeto atual. A API possui schemas Fastify nas rotas, e esses schemas foram complementados com descricoes e exemplos para ficarem prontos para uma futura integracao com Swagger.

Quando o Swagger UI for registrado no app, recomenda-se expor a documentacao em uma rota como:

```text
http://localhost:3000/docs
```

## Autenticacao

Nao ha autenticacao implementada nas rotas atuais. Nenhum endpoint exige header `Authorization`.

Observacao de seguranca: endpoints mutaveis (`POST`, `PATCH`, `DELETE`) nao devem ser expostos publicamente sem uma camada de autenticacao e autorizacao para curadoria/admin.

## Formato das Respostas

Listas simples:

```json
{
  "data": []
}
```

Listas paginadas:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

Recursos individuais retornam o objeto diretamente, sem envelope `data`.

## Recursos

- Health: `GET /health`
- Categorias: `/api/v1/categories`
- Autores: `/api/v1/authors`
- Artigos: `/api/v1/articles`
- Fontes de artigos: `/api/v1/article-sources`

Consulte [routes.md](./routes.md) para detalhes de cada endpoint, [examples.md](./examples.md) para exemplos de consumo e [errors.md](./errors.md) para o catalogo de erros.

## Fluxos Comuns

1. Listar categorias.
2. Listar artigos publicados por `categorySlug`.
3. Abrir detalhe do artigo por `slug`.
4. Consultar fontes retornadas no detalhe do artigo.

Para curadoria interna:

1. Criar autor.
2. Criar categoria.
3. Criar artigo como `draft`.
4. Criar fontes do artigo.
5. Atualizar artigo para `published` informando `publishedAt`.

## Divergencias Encontradas

- A solicitacao informa que Swagger/OpenAPI ja esta configurado, mas nao foram encontrados pacotes `@fastify/swagger` ou `@fastify/swagger-ui`, nem registro desses plugins em `src/app.ts`.
- A query `status` existe no schema de `GET /api/v1/articles`, mas a implementacao de listagem publica filtra sempre `status = 'published'`. Na pratica, valores diferentes de `published` nao alteram o retorno.
- O schema de resposta de `GET /api/v1/articles/featured` aceita os mesmos filtros de `GET /api/v1/articles`; a implementacao sempre forca `featured=true`.
