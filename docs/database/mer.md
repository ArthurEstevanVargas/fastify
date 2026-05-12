# MER - Minha Saúde Feminina API

```mermaid
erDiagram
  categories ||--o{ articles : classifica
  authors ||--o{ articles : escreve
  articles ||--o{ article_sources : referencia

  categories {
    uuid id PK
    text name
    text slug UK
    text description
    integer display_order
    timestamptz created_at
    timestamptz updated_at
    timestamptz deleted_at
  }

  authors {
    uuid id PK
    text name
    text institution
    text bio
    text credentials
    timestamptz created_at
    timestamptz updated_at
    timestamptz deleted_at
  }

  articles {
    uuid id PK
    uuid category_id FK
    uuid author_id FK
    text title
    text slug UK
    text summary
    text content
    text status
    boolean is_featured
    timestamptz published_at
    tsvector search_vector
    timestamptz created_at
    timestamptz updated_at
    timestamptz deleted_at
  }

  article_sources {
    uuid id PK
    uuid article_id FK
    text title
    text description
    text url
    integer source_order
    timestamptz created_at
    timestamptz updated_at
    timestamptz deleted_at
  }
```

Cardinalidade:

- Uma categoria possui zero ou muitos artigos.
- Um autor possui zero ou muitos artigos.
- Um artigo possui zero ou muitas fontes.
- Uma fonte pertence a exatamente um artigo.
