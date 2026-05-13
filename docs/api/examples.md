# Exemplos de Consumo

Defina a URL base:

```bash
BASE_URL=http://localhost:3000
```

## cURL

### Health

```bash
curl "$BASE_URL/health"
```

### Listar categorias

```bash
curl "$BASE_URL/api/v1/categories"
```

### Buscar categoria por slug

```bash
curl "$BASE_URL/api/v1/categories/saude-menstrual"
```

### Listar artigos publicados por categoria

```bash
curl "$BASE_URL/api/v1/articles?categorySlug=saude-menstrual&page=1&pageSize=10"
```

### Buscar artigos por texto

```bash
curl "$BASE_URL/api/v1/articles/search?q=ciclo&page=1&pageSize=10"
```

### Obter detalhe de artigo

```bash
curl "$BASE_URL/api/v1/articles/como-acompanhar-o-ciclo-menstrual"
```

### Criar autor

```bash
curl -X POST "$BASE_URL/api/v1/authors" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dra. Ana Silva",
    "institution": "Clinica Exemplo",
    "bio": "Ginecologista com foco em saude feminina.",
    "credentials": "CRM 00000"
  }'
```

### Criar categoria

```bash
curl -X POST "$BASE_URL/api/v1/categories" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Saude Menstrual",
    "slug": "saude-menstrual",
    "description": "Conteudos sobre ciclo menstrual.",
    "displayOrder": 1
  }'
```

### Criar artigo como rascunho

```bash
curl -X POST "$BASE_URL/api/v1/articles" \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": "00000000-0000-0000-0000-000000000001",
    "authorId": "00000000-0000-0000-0000-000000000002",
    "title": "Como acompanhar o ciclo menstrual",
    "slug": "como-acompanhar-o-ciclo-menstrual",
    "summary": "Orientacoes praticas para acompanhar sinais do ciclo.",
    "content": "Conteudo completo do artigo.",
    "status": "draft",
    "isFeatured": false
  }'
```

### Publicar artigo

```bash
curl -X PATCH "$BASE_URL/api/v1/articles/00000000-0000-0000-0000-000000000003" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "published",
    "publishedAt": "2026-05-12T00:00:00.000Z"
  }'
```

### Criar fonte de artigo

```bash
curl -X POST "$BASE_URL/api/v1/article-sources" \
  -H "Content-Type: application/json" \
  -d '{
    "articleId": "00000000-0000-0000-0000-000000000003",
    "title": "Ministerio da Saude - Saude da Mulher",
    "description": "Referencia institucional usada no artigo.",
    "url": "https://www.gov.br/saude",
    "sourceOrder": 1
  }'
```

## JavaScript/TypeScript com fetch

### Cliente simples

```ts
const baseUrl = 'http://localhost:3000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers
    },
    ...init
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`${error.code}: ${error.message}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
```

### Listar artigos

```ts
type ArticleListResponse = {
  data: Array<{
    id: string;
    title: string;
    slug: string;
    summary: string;
    status: 'draft' | 'published' | 'archived';
    isFeatured: boolean;
    publishedAt: string | null;
    category: { id: string; name: string; slug: string };
    author: { id: string; name: string };
  }>;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

const articles = await request<ArticleListResponse>('/api/v1/articles?page=1&pageSize=10');
```

### Criar categoria

```ts
const category = await request('/api/v1/categories', {
  method: 'POST',
  body: JSON.stringify({
    name: 'Saude Menstrual',
    slug: 'saude-menstrual',
    description: 'Conteudos sobre ciclo menstrual.',
    displayOrder: 1
  })
});
```

### Publicar artigo

```ts
await request('/api/v1/articles/00000000-0000-0000-0000-000000000003', {
  method: 'PATCH',
  body: JSON.stringify({
    status: 'published',
    publishedAt: new Date().toISOString()
  })
});
```

## Boas Praticas para Consumidores

- Sempre envie `Content-Type: application/json` em requests com body.
- Trate erros pelo campo `code`, nao apenas pelo texto de `message`.
- Use `page` e `pageSize` em listagens de artigos.
- Use `slug` para URLs publicas de categorias e artigos quando apropriado.
- Nao presuma que listas terao itens; trate `data: []`.
- Para publicar artigos, envie `publishedAt` junto com `status: "published"`.
- Considere `204` como sucesso sem corpo em deletes.
- Nao exponha endpoints mutaveis publicamente sem autenticacao na camada de API/gateway.
