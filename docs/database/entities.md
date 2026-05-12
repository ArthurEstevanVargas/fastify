# Entidades do Banco de Dados

## categories

Representa as categorias temáticas do MVP. Campos obrigatórios: `id`, `name`, `slug`, `description`, `display_order`, `created_at` e `updated_at`. `deleted_at` indica remoção lógica.

## authors

Representa autores ou equipes responsáveis pelo conteúdo educativo. Campos obrigatórios: `id`, `name`, `created_at` e `updated_at`. `institution`, `bio` e `credentials` são opcionais.

## articles

Representa artigos educativos. Campos obrigatórios: `id`, `category_id`, `author_id`, `title`, `slug`, `summary`, `content`, `status`, `is_featured`, `created_at` e `updated_at`. `published_at` é obrigatório quando `status = 'published'`.

## article_sources

Representa fontes e referências vinculadas aos artigos. Campos obrigatórios: `id`, `article_id`, `title`, `source_order`, `created_at` e `updated_at`. `description` e `url` são opcionais.

## Relacionamentos

- `articles.category_id` referencia `categories.id` com `ON DELETE RESTRICT`.
- `articles.author_id` referencia `authors.id` com `ON DELETE RESTRICT`.
- `article_sources.article_id` referencia `articles.id` com `ON DELETE CASCADE`.

## Constraints e Índices

- Slugs ativos são únicos por índice parcial com `deleted_at IS NULL`.
- Chaves estrangeiras têm índices explícitos para joins e validação de integridade.
- Artigos publicados usam índice parcial por `published_at`.
- Artigos em destaque usam índice parcial por `is_featured = true`.
- Busca textual usa `search_vector` gerado e índice GIN.
